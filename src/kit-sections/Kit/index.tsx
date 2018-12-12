import { Atom, classes, F } from '@grammarly/focal'
import * as React from 'react'
import { Btn } from '../../_generic/ui/Btn'
import { Overlay } from '../../_generic/ui/Overlay'
import $ from './style.scss'

type TSectionProps = {
	children: React.ReactNode
}

export const Section = ({ children }: TSectionProps) => {
	return <div className={$.section}>{children}</div>
}

type TControlProps = {
	label?: string
	tip?: () => React.ReactNode
	children: React.ReactNode
}

export const Control = ({ children, label, tip }: TControlProps) => {
	let tipCtrl = null
	if (tip) {
		const props = {
			content: tip,
			stopPropagation: true,
			position: ['top', 'bottom'] as any,
			isOpen$: Atom.create(false),
		}
		tipCtrl = (
			<F.div {...classes($.tip, props.isOpen$.view((isOpen) => isOpen && $.active))}>
				<Overlay {...props}>
					<Btn
						narrow
						transparent
						ico="question"
						onClick={() => props.isOpen$.modify((v) => !v)}
					/>
				</Overlay>
			</F.div>
		)
	}
	return (
		<div className={$.control}>
			<div className={$.ctrl}>
				{Boolean(label) && <label>{label}</label>}
				{children}
			</div>
			{tipCtrl}
		</div>
	)
}
