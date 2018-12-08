import { lift } from '@grammarly/focal'
import cc from 'classcat'
import * as React from 'react'
import { Ico } from '../Ico'
import { icons } from '../Ico/icons'
import $ from './style.scss'

type TProps = {
	label?: string
	ico?: keyof typeof icons
	icoFill?: string
	icoAfterLabel?: true
	transparent?: true
	narrow?: true
	special?: true
	disabled?: boolean
}

export const Btn = ({
	label,
	ico,
	icoFill,
	icoAfterLabel,
	transparent,
	narrow,
	special,
	...props
}: TProps & React.HTMLProps<HTMLButtonElement>) => {
	const className = cc([
		$.btn,
		!narrow && $.wide,
		special && $.special,
		!transparent && $.normal,
		icoAfterLabel && $.icoAfterLabel,
	])
	return (
		<button type="button" {...props} className={className}>
			{ico && (
				<div className={$.ico}>
					<Ico ico={ico} fill={icoFill} />
				</div>
			)}
			{label && <div className={$.label}>{label}</div>}
		</button>
	)
}

export const BtnLifted = lift(Btn)
