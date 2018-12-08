import * as React from 'react'
import { setConfig, hot } from 'react-hot-loader'
import { actionsShell } from '../_generic/actions'
import { Shell } from './Shell'

setConfig({
	ignoreSFC: true, // RHL will be __completely__ disabled for SFC
	pureRender: true, // RHL will not change render method
})

export const App = hot(module)(
	class extends React.Component {
		componentDidMount() {
			actionsShell._mounted()
		}
		render() {
			return <Shell />
		}
	}
)
