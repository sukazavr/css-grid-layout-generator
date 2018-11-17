import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import merge from 'webpack-merge'
import prod from './webpack.prod'

export default merge(prod, {
	plugins: [new BundleAnalyzerPlugin()],
})
