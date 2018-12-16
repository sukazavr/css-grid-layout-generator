import { Dialog } from '@blueprintjs/core'
import * as React from 'react'
import { actionsShell } from '../../_generic/actions'
import { Ico } from '../../_generic/ui/Ico'
import { Video } from '../../_generic/ui/Video'
import $ from './style.scss'

const modalProps = {
	autoFocus: true,
	canEscapeKeyClose: true,
	canOutsideClickClose: true,
	enforceFocus: true,
	usePortal: true,
	style: {
		padding: 0,
		width: '90%',
		minWidth: '600px',
		maxWidth: '1100px',
	},
}

export class HowToUse extends React.PureComponent<{}, { isOpen: boolean }> {
	state = {
		isOpen: false,
	}

	private handleOpen = () => {
		actionsShell.howToUse()
		this.setState({ isOpen: true })
	}
	private handleClose = () => this.setState({ isOpen: false })

	render() {
		return (
			<>
				<div className={$.btn} onClick={this.handleOpen}>
					<span>
						How
						<br />
						To&nbsp;Use
					</span>
					<Ico ico="question" />
				</div>
				<Dialog onClose={this.handleClose} {...modalProps} {...this.state}>
					<Video autoplay />
				</Dialog>
			</>
		)
	}
}
