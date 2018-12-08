import webpack from 'webpack'
import { root, entryApp, pathPackage } from './paths'

export default {
	context: root,
	target: 'web',
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
	},
	entry: entryApp,
	plugins: [
		new webpack.DefinePlugin({
			'process.env.VERSION': JSON.stringify(require(pathPackage).version),
		}),
	],
	// Turn off various NodeJS environment polyfills Webpack adds to bundles.
	// They're supposed to be added only when used, but the heuristic is loose
	// (eg: existence of a variable called setImmedaite in any scope)
	node: {
		console: false,
		// Keep global, it's just an alias of window and used by many third party modules:
		global: true,
		// Inline __filename and __dirname values:
		__filename: 'mock',
		__dirname: 'mock',
		// Never embed a portable implementation of Node's Buffer module:
		Buffer: false,
		// Never embed a setImmediate implementation:
		setImmediate: false,
	},
}
