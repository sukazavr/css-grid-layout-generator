import { Label, Switch } from '@blueprintjs/core'
import { Atom, Lens } from '@grammarly/focal'
import * as React from 'react'
import { IUnit } from '../_generic/types/common'
import { GridUnitSize } from './GridUnitSize'
import { MapElement } from '../_generic/ui/MapElement'
const $ = require('../_generic/ui/Overlay/style.scss')

type TProps = {
	unit$: Atom<IUnit>
}

const MINMAX = 'minmax'
const parseMinMax = (v: string): [string, string, string] =>
	(/^minmax\((.+), (.+)\)$/.exec(v) as any) || []
const getMin = (v: string) => parseMinMax(v)[1]
const getMax = (v: string) => parseMinMax(v)[2]
const toMinmax = (min: string, max: string) => `minmax(${min}, ${max})`

export const UnitConfig = ({ unit$ }: TProps) => {
	const size$ = unit$.lens('size')
	return (
		<div
			style={{
				width: 'max-content',
			}}
		>
			<MapElement stream={size$}>
				{(size) => {
					let sizeElements: JSX.Element
					const isMinmax = size.includes(MINMAX)
					if (isMinmax) {
						const minSize$ = size$.lens(
							Lens.create(getMin, (nextMin, pSize) => toMinmax(nextMin, getMax(pSize)))
						)
						const maxSize$ = size$.lens(
							Lens.create(getMax, (nextMax, pSize) => toMinmax(getMin(pSize), nextMax))
						)
						sizeElements = (
							<>
								<Label>Min Size</Label>
								<GridUnitSize v$={minSize$} />
								<div className={$.space} />
								<Label>Max Size</Label>
								<GridUnitSize v$={maxSize$} />
							</>
						)
					} else {
						sizeElements = (
							<div>
								<Label>Size</Label>
								<GridUnitSize v$={unit$.lens('size')} />
							</div>
						)
					}
					return (
						<div className={$.group}>
							{sizeElements}
							<div className={$.space} />
							<Switch
								checked={isMinmax}
								label="minmax()"
								onChange={(event) => {
									const v = (event.target as HTMLInputElement).checked
									size$.set(v ? toMinmax(size, '1fr') : getMin(size))
								}}
							/>
						</div>
					)
				}}
			</MapElement>
		</div>
	)
}
