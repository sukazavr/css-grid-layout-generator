import * as React from 'react'
import { hot } from 'react-hot-loader'
import { actionsShell } from '../_generic/actions'
import { Shell } from './Shell'

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
