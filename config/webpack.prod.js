import CopyWebpackPlugin from 'copy-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import InlineManifestWebpackPlugin from 'inline-manifest-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import path from 'path'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { dist, indexHtml, publicAssets, scssModules, src } from './paths'
import common from './webpack.common'

const sep = path.sep === '\\' ? '\\' + path.sep : path.sep

const vendorList = [
	`@blueprintjs${sep}core`,
	`@grammarly${sep}focal`,
	'classcat',
	'clipboard-copy',
	'react(-dom)?',
	'react-beautiful-dnd',
	'react-portal',
	'react-tiny-popover',
	'rxjs(-compat)?',
].join('|')

const testVendor = new RegExp(`${sep}node_modules${sep}(${vendorList})${sep}`)

export default merge(common, {
	mode: 'production',
	output: {
		path: dist,
		filename: '[name].[contenthash].bundle.js',
		chunkFilename: '[name].[contenthash].chunk.js',
	},
	stats: {
		hash: true,
		timings: true,
		assets: true,
		chunks: true,
		chunkModules: false,
		modules: false,
		children: false,
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			minChunks: 2,
			cacheGroups: {
				default: false,
				vendor: {
					test: testVendor,
					name: 'vendor',
					chunks: 'initial',
					minChunks: 1,
				},
			},
		},
		minimizer: [
			new UglifyJSPlugin({
				parallel: true,
				uglifyOptions: {
					compress: {
						drop_console: true,
					},
					output: {
						comments: false,
					},
				},
			}),
			new OptimizeCSSAssetsPlugin(),
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': "'production'",
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].bundle.css',
			chunkFilename: '[name].[contenthash].chunk.css',
		}),
		new ForkTsCheckerWebpackPlugin(),
		new CopyWebpackPlugin([publicAssets]),
		new HtmlWebpackPlugin({
			inject: true,
			template: indexHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new InlineManifestWebpackPlugin(),
		new HtmlWebpackIncludeAssetsPlugin({
			assets: [
				{
					type: 'css',
					path: 'manifest.json',
					attributes: { rel: 'manifest' },
				},
			],
			append: true,
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: src,
				loader: 'awesome-typescript-loader',
				options: {
					transpileOnly: true,
					useBabel: true,
					babelCore: '@babel/core',
					babelOptions: {
						babelrc: false,
						presets: [
							['@babel/preset-env', { useBuiltIns: 'usage', modules: false, debug: true }],
						],
						plugins: ['@babel/plugin-syntax-dynamic-import'],
					},
				},
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: true,
							camelCase: true,
							importLoaders: true,
							// Chunks Hash changes every time when using css-modules
							// https://github.com/webpack-contrib/css-loader/issues/582
							localIdentName: '[local]-[path]',
						},
					},
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							includePaths: [scssModules],
						},
					},
				],
			},
		],
	},
})
