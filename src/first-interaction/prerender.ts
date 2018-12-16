import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Landing } from './Landing'

document.head.insertAdjacentHTML(
	'beforeend',
	'<link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">'
)

ReactDOM.render(React.createElement(Landing), document.body)
