import { F, reactiveList } from '@grammarly/focal'
import * as React from 'react'
import { combineLatest, Observable, Subscription } from 'rxjs'
import {
	distinctUntilChanged,
	endWith,
	filter,
	map,
	mergeMap,
	shareReplay,
	startWith,
	takeUntil,
	withLatestFrom,
} from 'rxjs/operators'
import { selectedItem$ } from '../items/state'
import { ca } from '../_generic/supply/action-helpers'
import { isShallowEqual } from '../_generic/supply/utils'
import { MapElement } from '../_generic/ui/MapElement'
import { ShowIf } from '../_generic/ui/ShowIf'
import $ from './style.scss'

type TProps = {
	colsLength$: Observable<number>
	rowsLength$: Observable<number>
}

export class AreaSelector extends React.PureComponent<TProps> {
	private areaRef = React.createRef<HTMLDivElement>()
	private sub: Subscription

	private units$ = combineLatest(this.props.colsLength$, this.props.rowsLength$, (cols, rows) => {
		const res: string[] = []
		for (let colIndex = 0; colIndex < cols; colIndex++) {
			for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
				res.push(colIndex + DIV + rowIndex)
			}
		}
		return res
	}).pipe(shareReplay(1))
	private isSelected$ = this.units$.map((units) => Boolean(units.length))
	private list$ = reactiveList(this.units$, (st) => {
		const [px, py] = st.split(DIV)
		return (
			<div
				key={st}
				className={$.unit}
				style={{ gridColumnStart: Number(px) + 1, gridRowStart: Number(py) + 1 }}
			/>
		)
	})
	private gridColumnEnd$ = this.props.colsLength$.map((v) => v + 2)
	private gridRowEnd$ = this.props.rowsLength$.map((v) => v + 2)

	componentDidMount() {
		const el = this.areaRef.current as HTMLDivElement
		this.sub = selection$
			.pipe(
				filter(Boolean),
				withLatestFrom(this.props.colsLength$, this.props.rowsLength$),
				map(([selection, colsLength, rowsLength]) => {
					if (colsLength && rowsLength) {
						const { x1, y1, x2, y2 } = selection
						const { left, top, width, height } = el.getBoundingClientRect()
						const hts = width / colsLength
						const vts = height / rowsLength
						const colStart = Math.ceil((x1 - left) / hts)
						const rowStart = Math.ceil((y1 - top) / vts)
						const colEnd = Math.ceil((x2 - left) / hts) + 1
						const rowEnd = Math.ceil((y2 - top) / vts) + 1
						return { colStart, rowStart, colEnd, rowEnd }
					} else {
						return { colStart: 1, rowStart: 1, colEnd: 2, rowEnd: 2 }
					}
				}),
				distinctUntilChanged(isShallowEqual)
			)
			.subscribe((location) => {
				selectedItem$.modify((item) => ({ ...item, ...location }))
			})
	}

	componentWillUnmount() {
		this.sub.unsubscribe()
	}

	render() {
		return (
			<F.div
				mount={this.areaRef}
				onMouseDown={down}
				onMouseMove={move}
				onMouseUp={up}
				className={$.area}
				style={{
					gridColumnStart: 2,
					gridRowStart: 2,
					gridColumnEnd: this.gridColumnEnd$,
					gridRowEnd: this.gridRowEnd$,
				}}
			>
				{this.list$}
				<ShowIf value={this.isSelected$} eq={true}>
					{() => (
						<F.div
							className={$.selectedArea}
							style={{
								gridArea: gridArea$,
							}}
						/>
					)}
				</ShowIf>
				<Selections />
			</F.div>
		)
	}
}

const Selections = () => (
	<MapElement stream={selectionStyle$}>
		{(style) => style && <div className={$.selection} style={style} />}
	</MapElement>
)

const down = ca<React.MouseEvent<HTMLDivElement>>()
const move = ca<React.MouseEvent<HTMLDivElement>>()
const up = ca<React.MouseEvent<HTMLDivElement>>()
const down$ = down.$
const move$ = move.$
const up$ = up.$

const selection$ = down$.pipe(
	mergeMap((e) => {
		const x1 = e.clientX
		const y1 = e.clientY
		return move$.pipe(
			map(({ clientX, clientY }) => {
				return {
					x1: Math.min(x1, clientX),
					y1: Math.min(y1, clientY),
					x2: Math.max(x1, clientX),
					y2: Math.max(y1, clientY),
				}
			}),
			takeUntil(up$),
			endWith(null)
		)
	}),
	startWith<null | { x1: number; y1: number; x2: number; y2: number }>(null),
	shareReplay(1)
)

const selectionStyle$ = selection$
	.pipe(withLatestFrom(selectedItem$.view('color')))
	.map(([selection, backgroundColor]) => {
		if (selection) {
			const { x1, y1, x2, y2 } = selection
			return { left: x1, top: y1, width: x2 - x1, height: y2 - y1, backgroundColor }
		} else {
			return null
		}
	})

const gridArea$ = selectedItem$.view(
	({ colStart, rowStart, colEnd, rowEnd }) => `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`
)

const DIV = ':'
