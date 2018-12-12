import { Atom } from '@grammarly/focal'
import * as React from 'react'
import Popover, { ArrowContainer, Position } from 'react-tiny-popover'
import { MapElement } from '../MapElement'
import $ from './style.scss'
import { Btn } from '../Btn'

type TProps = {
	isOpen$: Atom<boolean>
	position: Position[]
	content: () => React.ReactNode
	stopPropagation?: boolean
	children: JSX.Element
}

export const Overlay = ({
	isOpen$,
	position,
	content,
	children,
	stopPropagation = false,
}: TProps) => {
	const close = () => isOpen$.set(false)
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
					align="center"
					transitionDuration={0.2}
					padding={2}
					windowBorderPadding={16}
					onClickOutside={close}
					content={({ position: pos, targetRect, popoverRect }) => (
						<ArrowContainer
							position={pos}
							targetRect={targetRect}
							popoverRect={popoverRect}
							arrowColor="#4c4a56"
							arrowSize={10}
						>
							<div className={$.overlay} onClick={onContainerClick}>
								<div className={$.close}>
									<Btn transparent ico="close" onClick={close} />
								</div>
								{content()}
							</div>
						</ArrowContainer>
					)}
				>
					{children}
				</Popover>
			)}
		</MapElement>
	)
}
