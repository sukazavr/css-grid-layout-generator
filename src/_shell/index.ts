import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './App'
import './analytics'
import './blueprint.css'
import './overrides.css'

document.body.classList.add('bp3-dark')

export const mount = (el: HTMLElement) => {
	ReactDOM.render(React.createElement(App), el)
}
