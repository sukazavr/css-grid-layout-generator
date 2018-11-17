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
}
