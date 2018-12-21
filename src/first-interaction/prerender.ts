import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Landing } from './Landing'

if (process.env.NODE_ENV === 'production') {
	document.head.insertAdjacentHTML(
		'afterbegin',
		'<script async src="https://www.googletagmanager.com/gtag/js?id=UA-129342832-1"></script>'
	)
}

document.head.insertAdjacentHTML(
	'beforeend',
	'<link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">'
)

ReactDOM.render(React.createElement(Landing), document.body)
