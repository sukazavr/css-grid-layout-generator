import CopyWebpackPlugin from 'copy-webpack-plugin'
import CrittersPlugin from 'critters-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackExcludeAssetsPlugin from 'html-webpack-exclude-assets-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import ScriptExtHtmlPlugin from 'script-ext-html-webpack-plugin'
import SuppressChunksPlugin from 'suppress-chunks-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import merge from 'webpack-merge'
import { indexHtml, publicAssets, scssModules, src } from './paths'
import common from './webpack.common'

export default merge(common, {
	mode: 'production',
	output: {
		filename: '[name].[chunkhash:5].js',
		chunkFilename: '[name].[chunkhash:5].js',
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
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						inline: 1,
					},
					mangle: {
						safari10: true,
					},
					output: {
						safari10: true,
					},
				},
			}),
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': "'production'",
		}),
		new webpack.optimize.SplitChunksPlugin({}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:5].css',
			chunkFilename: '[name].[contenthash:5].css',
		}),
		new OptimizeCssAssetsPlugin({
			cssProcessorOptions: {
				postcssReduceIdents: {
					counterStyle: false,
					gridTemplate: false,
					keyframes: false,
				},
			},
		}),
		new ForkTsCheckerWebpackPlugin(),
		new CopyWebpackPlugin([publicAssets]),
		new HtmlWebpackPlugin({
			template: indexHtml,
			excludeAssets: [/prerender\..+\.js$/],
			minify: {
				removeComments: true,
				useShortDoctype: true,
				keepClosingSlash: true,
				collapseWhitespace: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
			},
		}),
		new HtmlWebpackExcludeAssetsPlugin(),
		new SuppressChunksPlugin(['prerender']),
		new ScriptExtHtmlPlugin({
			inline: ['logic'],
		}),
		new CrittersPlugin({
			// use <link rel="stylesheet" media="not x" onload="this.media='all'"> hack to load async css:
			preload: 'media',
			// inline all styles from any stylesheet below this size:
			inlineThreshold: 2000,
			// don't bother lazy-loading non-critical stylesheets below this size, just inline the non-critical styles too:
			minimumExternalSize: 4000,
			// don't emit <noscript> external stylesheet links since the app fundamentally requires JS anyway:
			noscriptFallback: false,
			// inline the tiny data URL fonts we have for the intro screen:
			inlineFonts: true,
			// (and don't lazy load them):
			preloadFonts: false,
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			defaultSizes: 'gzip',
			openAnalyzer: false,
		}),
	],
	module: {
		rules: [
			{
				test: indexHtml,
				loader: 'prerender-loader',
				options: {
					string: true,
					entry: 'src/first-interaction/prerender.ts',
				},
			},
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
						presets: [['@babel/preset-env', { useBuiltIns: 'usage', modules: false }]],
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
							url: false,
							import: false,
							modules: true,
							camelCase: true,
							importLoaders: 2,
							exportOnlyLocals: true,
							localIdentName: '[hash:base64:5]',
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
