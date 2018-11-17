import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import StyleLintPlugin from 'stylelint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { indexHtml, scssModules, src } from './paths'
import common from './webpack.common'

export default merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		hot: true,
		port: 36402,
		host: '0.0.0.0',
		public: 'localhost:36402',
		open: true,
		contentBase: false,
		watchOptions: {
			aggregateTimeout: 300,
		},
		// These settings suppress noisy webpack output so only errors are displayed to the console.
		noInfo: true,
		quiet: false,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false,
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': "'development'",
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new ForkTsCheckerWebpackPlugin(),
		new StyleLintPlugin({
			context: src,
			syntax: 'scss',
		}),
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
	],
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.tsx?$/,
				include: src,
				loader: 'tslint-loader',
			},
			{
				test: /\.tsx?$/,
				include: src,
				loader: 'awesome-typescript-loader',
				options: {
					transpileOnly: true,
					useTranspileModule: true,
					forceIsolatedModules: true,
					configFileName: 'tsconfig.dev.json',
					useCache: true,
					useBabel: true,
					babelCore: '@babel/core',
					babelOptions: {
						babelrc: false,
						presets: [['@babel/preset-env', { modules: false }]],
						plugins: ['@babel/plugin-syntax-dynamic-import', 'react-hot-loader/babel'],
					},
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
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
