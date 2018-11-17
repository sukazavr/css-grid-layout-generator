import * as React from 'react'
import Popover, { ArrowContainer, Position } from 'react-tiny-popover'
import { Atom } from '@grammarly/focal'
import { Subscription } from 'rxjs'
const $ = require('./style.scss')

type TProps = {
	isOpen$: Atom<boolean>
	position: Position[]
	content: () => JSX.Element
	children: JSX.Element
}

export class Overlay extends React.Component<TProps, { isOpen: boolean }> {
	state = { isOpen: this.props.isOpen$.get() }
	isOpenSub: Subscription
	componentDidMount() {
		this.isOpenSub = this.props.isOpen$.subscribe((v) => {
			this.setState((c) => (c.isOpen === v ? c : { isOpen: v }))
		})
	}
	componentWillUnmount() {
		this.isOpenSub.unsubscribe()
	}
	closeMenu = () => {
		this.props.isOpen$.set(false)
	}
	renderHandler() {
		return this.props.children
	}
	renderContent() {
		return this.props.content()
	}
	render() {
		return (
			<Popover
				isOpen={this.state.isOpen}
				position={this.props.position}
				align="start"
				disableReposition={true}
				transitionDuration={0.12}
				padding={2}
				onClickOutside={this.closeMenu}
				content={({ position, targetRect, popoverRect }) => (
					<ArrowContainer
						position={position}
						targetRect={targetRect}
						popoverRect={popoverRect}
						arrowColor="#85afb8"
						arrowSize={16}
					>
						<div className={$.overlay}>{this.renderContent()}</div>
					</ArrowContainer>
				)}
			>
				{this.renderHandler()}
			</Popover>
		)
	}
}
