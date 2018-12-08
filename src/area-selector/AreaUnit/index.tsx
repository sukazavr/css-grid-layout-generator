import { classes, F } from '@grammarly/focal'
import * as React from 'react'
import { actionsAreaSelector } from '../../_generic/actions'
import { ca } from '../../_generic/supply/action-helpers'
import { stateAreaSelector$ } from '../state'
import $ from './style.scss'

type TProps = {
	x: number
	y: number
}

export const AreaUnit = ({ x, y }: TProps) => {
	const det$ = stateAreaSelector$.map(({ startX, startY, endX, endY }) => {
		const isStart = x === startX && y === startY && 1
		const isEnd = x === endX && y === endY && 2
		const isInsideArea =
			startX && startY && endX && endY && x >= startX && x <= endX && y >= startY && y <= endY
		return isStart || isEnd || isInsideArea
	})
	const label$ = det$.map((v) => {
		return v === 1 ? 'Start Point' : v === 2 ? 'End Point' : null
	})
	const selected$ = det$.map((v) => v && $.selected)
	return (
		<F.div
			{...classes($.unit, selected$)}
			style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
			onMouseOver={() => hover({ x, y })}
			onMouseOut={leave}
			onClick={actionsAreaSelector.select({ x, y })}
		>
			<F.div className={$.label}>{label$}</F.div>
		</F.div>
	)
}

const hover = ca<{ x: number; y: number }>()
const leave = ca()
const leaveToUndef$ = leave.$.map(() => undefined)
