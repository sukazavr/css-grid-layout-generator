import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { merge, Observable, Subscription } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'
import { ca } from '../../_generic/supply/action-helpers'
import { MapElement } from '../../_generic/ui/MapElement'
const $ = require('./style.scss')

export const HLLeave = ca()
export const HLAddRow = ca<number>(null)
export const HLAddCol = ca<number>(null)
export const HLRemoveRow = ca<{ start: number; end: number }>(null)
export const HLRemoveCol = ca<{ start: number; end: number }>(null)

export class Highlighter extends React.PureComponent<{
	colsLength$: Observable<number>
	rowsLength$: Observable<number>
}> {
	sub: Subscription
	style$ = Atom.create<React.CSSProperties | undefined>(undefined)
	gColsLength$ = this.props.colsLength$.map((v) => v + 2)
	gRowsLength$ = this.props.rowsLength$.map((v) => v + 2)
	componentDidMount() {
		this.sub = merge(
			this.props.colsLength$.map(() => undefined),
			this.props.rowsLength$.map(() => undefined),
			HLLeave.$.pipe(
				withLatestFrom(this.style$),
				map(([, s]) => ({ ...s, opacity: 0 }))
			),
			HLRemoveCol.$.pipe(
				withLatestFrom(this.gRowsLength$),
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
				withLatestFrom(this.gColsLength$),
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
				withLatestFrom(this.gColsLength$, this.gRowsLength$),
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
				withLatestFrom(this.gColsLength$, this.gRowsLength$),
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
		).subscribe((s) => this.style$.set(s))
	}
	componentWillUnmount() {
		this.sub.unsubscribe()
	}
	render() {
		return (
			<MapElement stream={this.style$}>
				{(style) => <div className={$.highlighter} style={style} />}
			</MapElement>
		)
	}
}
