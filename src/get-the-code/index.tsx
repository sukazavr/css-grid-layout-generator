import { Button, Classes, Dialog, H4 } from '@blueprintjs/core'
import { lift } from '@grammarly/focal'
import cc from 'classcat'
import clipboardCopy from 'clipboard-copy'
import * as React from 'react'
import { css$, html$ } from '../preview/state'
import { actionsShell } from '../_generic/actions'
import { Btn } from '../_generic/ui/Btn'
import $ from './style.scss'

const modalProps = {
	title: 'Your freshly baked code',
	autoFocus: true,
	canEscapeKeyClose: true,
	canOutsideClickClose: true,
	enforceFocus: true,
	usePortal: true,
	isCloseButtonShown: false,
	style: {
		width: '90%',
		minWidth: '600px',
		maxWidth: '1100px',
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
					<div className={cc([Classes.DIALOG_BODY, $.body])}>
						<div className={$.css}>
							<Code lang="css" code={css$} />
						</div>
						<div className={$.html}>
							<Code lang="html" code={html$} />
						</div>
					</div>
					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button onClick={this.handleClose}>Close</Button>
							{/* <AnchorButton
								intent={Intent.PRIMARY}
								href="https://www.palantir.com/palantir-foundry/"
								target="_blank"
							>
								Visit the Foundry website
							</AnchorButton> */}
						</div>
					</div>
				</Dialog>
			</>
		)
	}
}

const Code = lift(({ lang, code }: { lang: string; code: string }) => {
	return (
		<>
			<H4>{lang.toUpperCase()}</H4>
			<Btn
				ico="copy"
				icoFill="#fff"
				icoAfterLabel
				narrow
				label="Copy To Clipboard"
				onClick={() => clipboardCopy(code)}
			/>
			<pre className={Classes.CODE_BLOCK}>{code}</pre>
		</>
	)
})
