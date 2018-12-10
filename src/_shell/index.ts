import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { getRootNode } from '../_generic/supply/get-root-node'
import { App } from './App'
import './analytics'
import './blueprint.css'
import './overrides.css'

document.write(
	'<link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">'
)

document.body.classList.add('bp3-dark')

ReactDOM.render(React.createElement(App), getRootNode())
