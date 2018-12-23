import { Button, Classes, Dialog, H4, Tab, Tabs } from '@blueprintjs/core'
import clipboardCopy from 'clipboard-copy'
import * as React from 'react'
import { Observable } from 'rxjs'
import { css$, html$, jsxCSSModules$, jsxPlain$, styledComponents$ } from '../preview/state'
import { actionsShell } from '../_generic/actions'
import { Btn } from '../_generic/ui/Btn'
import { MapElement } from '../_generic/ui/MapElement'
import $ from './style.scss'

const modalProps = {
	autoFocus: true,
	canEscapeKeyClose: true,
	canOutsideClickClose: true,
	enforceFocus: true,
	usePortal: true,
	style: {
		width: '90%',
		minWidth: '600px',
		maxWidth: '1100px',
		minHeight: '82vh',
	},
}

export class GetTheCode extends React.PureComponent<{}, { isOpen: boolean }> {
	state = {
		isOpen: false,
	}

	private handleOpen = () => {
		actionsShell.getCode()
		this.setState({ isOpen: true })
	}
	private handleClose = () => this.setState({ isOpen: false })

	render() {
		return (
			<>
				<Btn onClick={this.handleOpen} label="Get The Code" special />
				<Dialog onClose={this.handleClose} {...modalProps} {...this.state}>
					<div className={Classes.DIALOG_BODY}>
						<Tabs id="code" defaultSelectedTabId="General" large renderActiveTabPanelOnly>
							<Tab id="General" title="General" panel={<General />} />
							<Tab id="JSX" title="JSX" panel={<JSX />} />
							<Tab
								id="StyledComponents"
								title="Styled Components"
								panel={<StyledComponents />}
							/>
						</Tabs>
					</div>
					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button onClick={this.handleClose}>Close</Button>
						</div>
					</div>
				</Dialog>
			</>
		)
	}
}

const General = () => (
	<div className={$.split}>
		<div style={{ flexGrow: 2 }}>
			<Code lang="css" code$={css$} />
		</div>
		<div style={{ flexGrow: 1 }}>
			<Code lang="html" code$={html$} />
		</div>
	</div>
)

const JSX = () => (
	<div className={$.split}>
		<div style={{ flexGrow: 1 }}>
			<Code lang="Plain" code$={jsxPlain$} />
		</div>
		<div style={{ flexGrow: 1 }}>
			<Code lang="CSS Modules" code$={jsxCSSModules$} />
		</div>
	</div>
)

const StyledComponents = () => <Code lang="Styled Components" code$={styledComponents$} />

class Code extends React.PureComponent<{ lang: string; code$: Observable<string> }> {
	private ref = React.createRef<HTMLPreElement>()
	private toClipboard = () => {
		const el = this.ref.current
		const code = el && (el.textContent || el.innerText)
		if (code) {
			clipboardCopy(code)
		}
	}
	render() {
		return (
			<>
				<H4>{this.props.lang.toUpperCase()}</H4>
				<Btn
					ico="copy"
					icoFill="#fff"
					icoAfterLabel
					narrow
					label="Copy To Clipboard"
					onClick={this.toClipboard}
				/>
				<MapElement stream={this.props.code$}>
					{(__html) => <pre ref={this.ref} className={$.code} dangerouslySetInnerHTML={{ __html }} />}
				</MapElement>
			</>
		)
	}
}
