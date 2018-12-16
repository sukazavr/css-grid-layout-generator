import { Atom, classes, F } from '@grammarly/focal'
import * as React from 'react'
import { Observable } from 'rxjs'
import { Btn } from '../../_generic/ui/Btn'
import { Overlay } from '../../_generic/ui/Overlay'
import { ShowIf } from '../../_generic/ui/ShowIf'
import $ from './style.scss'

type TSectionProps = {
	title?: string
	subtitle?: Observable<string>
	children: React.ReactNode
}

export const Section = ({ title, subtitle, children }: TSectionProps) => {
	if (title) {
		const isOpen$ = Atom.create(false)
		return (
			<div className={$.section}>
				<F.div
					{...classes($.header, isOpen$.map((v) => v && $.active))}
					onClick={() => isOpen$.modify((v) => !v)}
				>
					<div className={$.title}>{title}</div>
					{subtitle && <F.div className={$.subtitle}>{subtitle}</F.div>}
				</F.div>
				<ShowIf value={isOpen$} eq={true}>
					{() => <div className={$.content}>{children}</div>}
				</ShowIf>
			</div>
		)
	} else {
		return (
			<div className={$.section}>
				<div className={$.content}>{children}</div>
			</div>
		)
	}
}

type TControlProps = {
	label?: string
	tip?: () => React.ReactNode
	children: React.ReactNode
}

export const Control = ({ children, label, tip }: TControlProps) => {
	let tipCtrl = null
	if (tip) {
		const isOpen$ = Atom.create(false)
		const props = {
			isOpen$,
			content: tip,
			stopPropagation: true,
			position: ['top', 'bottom'] as any,
			close: () => isOpen$.set(false),
		}
		tipCtrl = (
			<F.div {...classes($.tip, isOpen$.view((v) => v && $.active))}>
				<Overlay {...props}>
					<Btn narrow transparent ico="question" onClick={() => isOpen$.modify((v) => !v)} />
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
