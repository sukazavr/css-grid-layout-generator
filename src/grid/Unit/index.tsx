import { Atom, classes, F, lift } from '@grammarly/focal'
import * as React from 'react'
import { merge } from 'rxjs'
import { filter, map, startWith, withLatestFrom } from 'rxjs/operators'
import { actionsGrid } from '../../_generic/actions'
import { ca } from '../../_generic/supply/action-helpers'
import { Btn } from '../../_generic/ui/Btn'
import { colsLength$, rowsLength$ } from '../state'
const $ = require('./style.scss')

type TProps = {
	x: number
	y: number
	disabledRemoveCol: boolean
	disabledRemoveRow: boolean
}

// tslint:disable:max-line-length
export const Unit = ({ x, y, disabledRemoveCol, disabledRemoveRow }: TProps) => {
	const className$ = merge(
		leaveToUndef$,
		hoverRemoveCol.$.pipe(
			filter((v) => !disabledRemoveCol && v === x),
			map(() => $.removeCol)
		),
		hoverRemoveRow.$.pipe(
			filter((v) => !disabledRemoveRow && v === y),
			map(() => $.removeRow)
		)
	).pipe(startWith(undefined))
	return (
		<F.div
			{...classes($.unit, className$)}
			style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
		>
			<div>
				<Btn
					ico="addTop"
					transparent
					onMouseOver={() => hoverRow(y - 1)}
					onMouseOut={leave}
					onClick={actionsGrid.add({ pos: y - 1, isR: true })}
				/>
			</div>
			<div>
				<Btn
					ico="addBottom"
					transparent
					onMouseOver={() => hoverRow(y)}
					onMouseOut={leave}
					onClick={actionsGrid.add({ pos: y, isR: true })}
				/>
			</div>
			<div>
				<Btn
					ico="addLeft"
					transparent
					onMouseOver={() => hoverCol(x - 1)}
					onMouseOut={leave}
					onClick={actionsGrid.add({ pos: x - 1 })}
				/>
			</div>
			<div>
				<Btn
					ico="addRight"
					transparent
					onMouseOver={() => hoverCol(x)}
					onMouseOut={leave}
					onClick={actionsGrid.add({ pos: x })}
				/>
			</div>
			<div>
				<Btn
					ico="removeCol"
					transparent
					disabled={disabledRemoveCol}
					onMouseOver={() => hoverRemoveCol(x)}
					onMouseOut={leave}
					onClick={actionsGrid.del({ pos: x - 1 })}
				/>
			</div>
			<div>
				<Btn
					ico="removeRow"
					transparent
					disabled={disabledRemoveRow}
					onMouseOver={() => hoverRemoveRow(y)}
					onMouseOut={leave}
					onClick={actionsGrid.del({ pos: y - 1, isR: true })}
				/>
			</div>
		</F.div>
	)
}

export const Highlighter = () => <LiftedHighlighter style={hStyle$} />

const LiftedHighlighter = lift(({ style }: { style?: React.CSSProperties }) => (
	<div className={$.highlighter} style={style} />
))

const hoverRow = ca<number>()
const hoverCol = ca<number>()
const hoverRemoveCol = ca<number>()
const hoverRemoveRow = ca<number>()
const leave = ca()
const leaveToUndef$ = leave.$.map(() => undefined)

const hStyle$ = Atom.create<React.CSSProperties | undefined>(undefined)

merge(
	actionsGrid.del.$.map(() => undefined),
	leave.$.pipe(
		withLatestFrom(hStyle$),
		map(([, s]) => ({ ...s, opacity: 0 }))
	),
	hoverCol.$.pipe(
		withLatestFrom(colsLength$, rowsLength$),
		map(([x, colsLength, rowsLength]) => {
			const isLast = colsLength === x
			return {
				opacity: isLast ? 1 : 0.6,
				gridColumnStart: x + 1,
				gridColumnEnd: x + 2,
				gridRowStart: 1,
				gridRowEnd: rowsLength + 2,
				height: 'auto',
				width: `${isLast ? 1 : 2}em`,
				justifySelf: 'flex-end',
				marginRight: isLast ? undefined : '-1em',
				background: isLast
					? 'linear-gradient(to left, #62ff00 0%, rgba(0, 0, 0, 0) 100%)'
					: 'linear-gradient(to left, rgba(0, 0, 0, 0) 0%, #62ff00 50%, rgba(0, 0, 0, 0) 100%)',
			} as React.CSSProperties
		})
	),
	hoverRow.$.pipe(
		withLatestFrom(colsLength$, rowsLength$),
		map(([y, colsLength, rowsLength]) => {
			const isLast = rowsLength === y
			return {
				opacity: isLast ? 1 : 0.6,
				gridColumnStart: 1,
				gridColumnEnd: colsLength + 2,
				gridRowStart: y + 1,
				gridRowEnd: y + 2,
				height: `${isLast ? 1 : 2}em`,
				width: 'auto',
				alignSelf: 'flex-end',
				marginBottom: isLast ? undefined : '-1em',
				background: isLast
					? 'linear-gradient(to top, #62ff00 0%, rgba(0, 0, 0, 0) 100%)'
					: 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, #62ff00 50%, rgba(0, 0, 0, 0) 100%)',
			} as React.CSSProperties
		})
	)
).subscribe((s) => hStyle$.set(s))
