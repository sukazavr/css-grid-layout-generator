import { Atom, classes, F, lift, reactiveList } from '@grammarly/focal'
import * as React from 'react'
import { AreaUnit } from '../area-selector/AreaUnit'
import { blindByAreaSelector$, isActiveAreaSelector$ } from '../area-selector/state'
import './epic'
import {
	colsIDs$,
	colsLength$,
	getColByIndex,
	getRowByIndex,
	rowsIDs$,
	rowsLength$,
	grid$,
} from './state'
import { Highlighter, Unit } from './Unit'
import { Overlay } from '../_generic/ui/Overlay'
import { UnitConfig } from '../overlay-configs/UnitConfig'
import { GridConfig } from '../overlay-configs/GridConfig'
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

		{reactiveList(colsIDs$, (index) => {
			const col$ = getColByIndex(index)
			const title$ = col$.view('size')
			const isOpen$ = col$.lens('isEditorOpen')
			return (
				<Overlay
					key={index}
					isOpen$={isOpen$}
					position={['bottom', 'right', 'left', 'top']}
					content={() => <UnitConfig unit$={col$} />}
				>
					<F.div
						{...classes($.row, blindByAreaSelector$)}
						style={{ gridColumnStart: index + 2 }}
						onClick={() => isOpen$.set(true)}
					>
						<F.span>{title$}</F.span>
					</F.div>
				</Overlay>
			)
		})}

		{reactiveList(rowsIDs$, (index) => {
			const row$ = getRowByIndex(index)
			const title$ = row$.view('size')
			const isOpen$ = row$.lens('isEditorOpen')
			return (
				<Overlay
					key={index}
					isOpen$={isOpen$}
					position={['right', 'top', 'bottom', 'left']}
					content={() => <UnitConfig unit$={row$} />}
				>
					<F.div
						{...classes($.col, blindByAreaSelector$)}
						style={{ gridRowStart: index + 2 }}
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
			return (
				<UnitSwitcher
					key={st}
					x={x}
					y={y}
					disabledRemoveCol={px === LAST}
					disabledRemoveRow={py === LAST}
					isActiveAreaSelector={isActiveAreaSelector$}
				/>
			)
		})}

		<Highlighter />
	</F.div>
)

type TUnitSwitcherProps = {
	isActiveAreaSelector: boolean
	x: number
	y: number
	disabledRemoveCol: boolean
	disabledRemoveRow: boolean
}

const UnitSwitcher = lift(
	({ isActiveAreaSelector, x, y, disabledRemoveCol, disabledRemoveRow }: TUnitSwitcherProps) => {
		return isActiveAreaSelector ? (
			<AreaUnit x={x} y={y} />
		) : (
			<Unit
				x={x}
				y={y}
				disabledRemoveCol={disabledRemoveCol}
				disabledRemoveRow={disabledRemoveRow}
			/>
		)
	}
)
