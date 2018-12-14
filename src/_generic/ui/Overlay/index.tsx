import * as React from 'react'
import Popover, { Align, ArrowContainer, Position } from 'react-tiny-popover'
import { Observable } from 'rxjs'
import { Btn } from '../Btn'
import { MapElement } from '../MapElement'
import $ from './style.scss'

type TProps = {
	isOpen$: Observable<boolean>
	children: JSX.Element
	content: () => React.ReactNode
	align?: Align
	withArrow?: boolean
	position?: Position | Position[]
	stopPropagation?: boolean
	close?: () => void
}

export const Overlay = ({
	isOpen$,
	children,
	content,
	align = 'center',
	withArrow = true,
	position,
	stopPropagation = false,
	close,
}: TProps) => {
	let onContainerClick: ((e: React.MouseEvent<HTMLDivElement>) => void) | undefined
	if (stopPropagation) {
		onContainerClick = (e) => {
			e.stopPropagation()
		}
	}
	return (
		<MapElement stream={isOpen$}>
			{(isOpen) => (
				<Popover
					isOpen={isOpen}
					position={position}
					align={align}
					transitionDuration={0.000000000001}
					padding={withArrow ? 2 : 8}
					windowBorderPadding={16}
					onClickOutside={close}
					content={({ position: pos, targetRect, popoverRect }) => {
						const overlay = (
							<div className={$.overlay} onClick={onContainerClick}>
								{Boolean(close) && (
									<div className={$.close}>
										<Btn transparent ico="close" onClick={close} />
									</div>
								)}
								{content()}
							</div>
						)
						return withArrow ? (
							<ArrowContainer
								position={pos}
								targetRect={targetRect}
								popoverRect={popoverRect}
								arrowColor="#4c4a56"
								arrowSize={10}
								arrowStyle={{ zIndex: 1 }}
							>
								{overlay}
							</ArrowContainer>
						) : (
							overlay
						)
					}}
				>
					{children}
				</Popover>
			)}
		</MapElement>
	)
}
