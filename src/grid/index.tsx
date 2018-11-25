import { Atom, classes, F, lift, reactiveList } from '@grammarly/focal'
import * as React from 'react'
import { AreaUnit } from '../area-selector/AreaUnit'
import { blindByAreaSelector$, isActiveAreaSelector$ } from '../area-selector/state'
import './epic'
import {
	colsKeys$,
	colsLength$,
	getColByIndex,
	getRowByIndex,
	rowsKeys$,
	rowsLength$,
	grid$,
	parseTrackKey,
} from './state'
import { Overlay } from '../_generic/ui/Overlay'
import { UnitConfig } from '../overlay-configs/UnitConfig'
import { GridConfig } from '../overlay-configs/GridConfig'
import { IUnit } from '../_generic/types/common'
import { actionsGrid } from '../_generic/actions'
import { Highlighter } from './Highlighter'
const $ = require('./style.scss')

const DIV = ':'
const LAST = 'LAST'
const units$ = Atom.combine(colsLength$, rowsLength$, (cols, rows) => {
	const res: string[] = []
	for (let colIndex = 0; colIndex < cols; colIndex++) {
		const x = cols > 1 ? colIndex : LAST
		for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
			const y = rows > 1 ? rowIndex : LAST
			res.push(x + DIV + y)
		}
	}
	return res
})

const isGridConfigOpen$ = grid$.lens('isEditorOpen')

const unitTitle = ({ value, min, max, minmax, repeat }: IUnit) => {
	let title = minmax ? `${min}→${max}` : value
	if (repeat) {
		title = `${repeat}${typeof repeat === 'number' ? '×' : ''} ${title}`
	}
	return title
}

// tslint:disable:max-line-length
export const Grid = () => (
	<F.div className={$.container}>
		<Overlay
			isOpen$={isGridConfigOpen$}
			position={['right', 'bottom', 'left', 'top']}
			content={() => <GridConfig grid$={grid$} />}
		>
			<F.div
				{...classes($.config, blindByAreaSelector$)}
				onClick={() => isGridConfigOpen$.set(true)}
			>
				<svg viewBox="0 0 40 40">
					<path d="m25.9 20q0-2.4-1.7-4t-4.1-1.7-4 1.7-1.7 4 1.7 4 4 1.7 4.1-1.7 1.7-4z m11.4-2.4v4.9q0 0.3-0.2 0.5t-0.4 0.3l-4.2 0.6q-0.4 1.3-0.8 2.1 0.7 1.1 2.3 3.1 0.3 0.2 0.3 0.5t-0.2 0.5q-0.6 0.9-2.2 2.4t-2.1 1.6q-0.3 0-0.6-0.2l-3.1-2.4q-1 0.5-2 0.9-0.4 3-0.7 4.1-0.1 0.6-0.8 0.6h-4.9q-0.3 0-0.6-0.1t-0.2-0.5l-0.7-4.1q-1.1-0.4-2-0.9l-3.1 2.4q-0.2 0.2-0.6 0.2-0.3 0-0.5-0.2-2.8-2.6-3.7-3.8-0.2-0.2-0.2-0.5 0-0.2 0.2-0.5 0.3-0.5 1.1-1.5t1.2-1.5q-0.6-1.2-0.9-2.3l-4.1-0.6q-0.2 0-0.4-0.2t-0.2-0.6v-4.9q0-0.3 0.2-0.5t0.4-0.3l4.2-0.7q0.3-1 0.8-2-0.9-1.3-2.4-3.1-0.2-0.3-0.2-0.5 0-0.2 0.2-0.5 0.6-0.8 2.2-2.4t2.1-1.6q0.3 0 0.6 0.2l3.1 2.4q1-0.5 2-0.9 0.4-3 0.7-4.1 0.1-0.6 0.8-0.6h4.9q0.3 0 0.6 0.1t0.2 0.5l0.7 4.1q1 0.4 2 0.9l3.1-2.4q0.2-0.2 0.6-0.2 0.3 0 0.5 0.2 2.9 2.6 3.7 3.8 0.2 0.2 0.2 0.5 0 0.2-0.2 0.5-0.4 0.5-1.2 1.5t-1.2 1.5q0.6 1.2 1 2.2l4 0.7q0.3 0 0.5 0.2t0.2 0.6z" />
				</svg>
			</F.div>
		</Overlay>

		{colsKeys$.view(
			(v) =>
				v.length ? null : (
					<div className={$.col} style={{ gridColumnStart: 2 }} onClick={actionsGrid.addCol}>
						<span>Add Column</span>
					</div>
				)
		)}

		{rowsKeys$.view(
			(v) =>
				v.length ? null : (
					<div className={$.row} style={{ gridRowStart: 2 }} onClick={actionsGrid.addRow}>
						<span>Add Row</span>
					</div>
				)
		)}

		{reactiveList(colsKeys$, (key) => {
			const [index, gridColumnStart, gridColumnEnd] = parseTrackKey(key)
			const col$ = getColByIndex(index)
			const title$ = col$.view(unitTitle)
			const isOpen$ = col$.lens('isEditorOpen')
			return (
				<Overlay
					key={key}
					isOpen$={isOpen$}
					position={['bottom', 'right', 'left', 'top']}
					content={() => (
						<UnitConfig unit$={col$} start={gridColumnStart} end={gridColumnEnd} />
					)}
				>
					<F.div
						{...classes($.col, blindByAreaSelector$)}
						style={{ gridColumnStart, gridColumnEnd }}
						onClick={() => isOpen$.set(true)}
					>
						<F.span>{title$}</F.span>
					</F.div>
				</Overlay>
			)
		})}

		{reactiveList(rowsKeys$, (key) => {
			const [index, gridRowStart, gridRowEnd] = parseTrackKey(key)
			const row$ = getRowByIndex(index)
			const title$ = row$.view(unitTitle)
			const isOpen$ = row$.lens('isEditorOpen')
			return (
				<Overlay
					key={key}
					isOpen$={isOpen$}
					position={['right', 'top', 'bottom', 'left']}
					content={() => <UnitConfig unit$={row$} row start={gridRowStart} end={gridRowEnd} />}
				>
					<F.div
						{...classes($.row, blindByAreaSelector$)}
						style={{ gridRowStart, gridRowEnd }}
						onClick={() => isOpen$.set(true)}
					>
						<F.span>{title$}</F.span>
					</F.div>
				</Overlay>
			)
		})}

		{reactiveList(units$, (st) => {
			const [px, py] = st.split(DIV)
			const x = px === LAST ? 1 : Number(px) + 1
			const y = py === LAST ? 1 : Number(py) + 1
			return <UnitSwitcher key={st} x={x} y={y} isActiveAreaSelector={isActiveAreaSelector$} />
		})}

		<Highlighter />
	</F.div>
)

type TUnitSwitcherProps = {
	isActiveAreaSelector: boolean
	x: number
	y: number
}

const UnitSwitcher = lift(({ isActiveAreaSelector, x, y }: TUnitSwitcherProps) => {
	return isActiveAreaSelector ? (
		<AreaUnit x={x} y={y} />
	) : (
		<div className={$.unit} style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }} />
	)
})
