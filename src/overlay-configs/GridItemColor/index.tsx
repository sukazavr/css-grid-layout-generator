import { Atom, F } from '@grammarly/focal'
import * as React from 'react'
import { COLORS } from '../../_generic/supply/get-color'
const $ = require('./style.scss')

export const GridItemColor = ({ v$ }: { v$: Atom<string> }) => {
	return (
		<div className={$.container}>
			{COLORS.map((color) => (
				<F.div
					key={color}
					className={$.color}
					style={{
						boxShadow: v$.view(
							(v) => `${color} 0px 0px 0px ${v === color ? 0.2 : 1}em inset`
						),
					}}
					onClick={() => v$.set(color)}
				/>
			))}
		</div>
	)
}
