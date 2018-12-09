import * as React from 'react'
import $ from './style.scss'

type TSectionProps = {
	children: React.ReactNode
}

export const Section = ({ children }: TSectionProps) => {
	return <div className={$.section}>{children}</div>
}

type TControlProps = {
	label?: string
	children: React.ReactNode
}

export const Control = ({ children, label }: TControlProps) => {
	return (
		<div className={$.control}>
			{Boolean(label) && <label>{label}</label>}
			{children}
		</div>
	)
}
