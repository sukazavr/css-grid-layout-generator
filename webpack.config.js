const TARGET = process.env.npm_lifecycle_event

if (!TARGET || TARGET === 'dev:app') {
	module.exports = require('./config/webpack.dev')
	console.info('--> ./config/webpack.dev.js')
} else if (TARGET === 'build:app') {
	module.exports = require('./config/webpack.prod')
	console.info('--> ./config/webpack.prod.js')
} else if (TARGET === 'build:analyze') {
	module.exports = require('./config/webpack.analyze')
	console.info('--> ./config/webpack.analyze.js')
}
