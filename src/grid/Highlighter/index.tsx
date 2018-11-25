import { Atom, lift } from '@grammarly/focal'
import * as React from 'react'
import { merge } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'
import { ca } from '../../_generic/supply/action-helpers'
import { colsLength$, rowsLength$ } from '../state'
const $ = require('./style.scss')

export const Highlighter = () => <LiftedHighlighter style={hStyle$} />

const LiftedHighlighter = lift(({ style }: { style?: React.CSSProperties }) => (
	<div className={$.highlighter} style={style} />
))

export const HLLeave = ca()
export const HLAddRow = ca<number>(null)
export const HLAddCol = ca<number>(null)
export const HLRemoveRow = ca<{ start: number; end: number }>(null)
export const HLRemoveCol = ca<{ start: number; end: number }>(null)

const hStyle$ = Atom.create<React.CSSProperties | undefined>(undefined)

const gColsLength$ = colsLength$.map((v) => v + 2)
const gRowsLength$ = rowsLength$.map((v) => v + 2)

merge(
	colsLength$.map(() => undefined),
	rowsLength$.map(() => undefined),
	HLLeave.$.pipe(
		withLatestFrom(hStyle$),
		map(([, s]) => ({ ...s, opacity: 0 }))
	),
	HLRemoveCol.$.pipe(
		withLatestFrom(gRowsLength$),
		map(([{ start, end }, gRowsLength]) => {
			return {
				opacity: 0.5,
				gridColumnStart: start,
				gridColumnEnd: end,
				gridRowStart: 1,
				gridRowEnd: gRowsLength,
				background: '#ff3100',
			} as React.CSSProperties
		})
	),
	HLRemoveRow.$.pipe(
		withLatestFrom(gColsLength$),
		map(([{ start, end }, gColsLength]) => {
			return {
				opacity: 0.5,
				gridColumnStart: 1,
				gridColumnEnd: gColsLength,
				gridRowStart: start,
				gridRowEnd: end,
				background: '#ff3100',
			} as React.CSSProperties
		})
	),
	HLAddCol.$.pipe(
		withLatestFrom(gColsLength$, gRowsLength$),
		map(([pos, gColsLength, gRowsLength]) => {
			const isLast = gColsLength === pos
			return {
				opacity: isLast ? 1 : 0.6,
				gridColumnStart: pos - 1,
				gridColumnEnd: pos,
				gridRowStart: 1,
				gridRowEnd: gRowsLength,
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
	HLAddRow.$.pipe(
		withLatestFrom(gColsLength$, gRowsLength$),
		map(([pos, gColsLength, gRowsLength]) => {
			const isLast = gRowsLength === pos
			return {
				opacity: isLast ? 1 : 0.6,
				gridColumnStart: 1,
				gridColumnEnd: gColsLength,
				gridRowStart: pos - 1,
				gridRowEnd: pos,
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
