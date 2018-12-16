import path from 'path'
import webpack from 'webpack'
import { prerender, logic, dist, pathPackage, root } from './paths'

const VERSION = require(pathPackage).version

export default {
	context: root,
	target: 'web',
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
	},
	entry: {
		prerender,
		logic,
	},
	output: {
		filename: '[name].js',
		path: dist,
		publicPath: '/',
		globalObject: 'self',
	},
	plugins: [
		new webpack.DefinePlugin({
			// We set node.process=false later in this config.
			// Here we make sure if (process && process.foo) still works:
			process: JSON.stringify({ env: { VERSION } }),
		}),
		new webpack.NormalModuleReplacementPlugin(
			/.*\/generated\/iconSvgPaths.*/,
			path.resolve(__dirname, 'iconSvgPaths.js')
		),
	],
	// Turn off various NodeJS environment polyfills Webpack adds to bundles.
	// They're supposed to be added only when used, but the heuristic is loose
	// (eg: existence of a variable called setImmedaite in any scope)
	node: {
		console: false,
		// Keep global, it's just an alias of window and used by many third party modules:
		global: true,
		// Turn off process to avoid bundling a nextTick implementation:
		process: false,
		// Inline __filename and __dirname values:
		__filename: 'mock',
		__dirname: 'mock',
		// Never embed a portable implementation of Node's Buffer module:
		Buffer: false,
		// Never embed a setImmediate implementation:
		setImmediate: false,
	},
}
