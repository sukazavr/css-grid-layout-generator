import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import StyleLintPlugin from 'stylelint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { indexHtml, scssModules, src, publicAssets } from './paths'
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
		contentBase: publicAssets,
		watchOptions: {
			aggregateTimeout: 300,
		},
		// Request paths not ending in a file extension serve index.html:
		historyApiFallback: true,
		// Suppress forwarding of Webpack logs to the browser console:
		clientLogLevel: 'none',
		// Supress the extensive stats normally printed after a dev build (since sizes are mostly useless):
		stats: 'minimal',
		// Don't embed an error overlay ("redbox") into the client bundle:
		overlay: false,
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
							url: false,
							import: false,
							sourceMap: true,
							modules: true,
							camelCase: true,
							importLoaders: 2,
							exportOnlyLocals: true,
							localIdentName: '[local]__[hash:base64:5]',
						},
					},
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							includePaths: [scssModules],
						},
					},
				],
			},
		],
	},
})
