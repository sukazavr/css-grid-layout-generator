import { Atom, Lens } from '@grammarly/focal'
import { defaultUnit, IUnit, IGrid, defaultGrid } from '../_generic/types/common'

const packTrackKeys = (v: IUnit[]) => {
	let prev = 2
	return v.map(({ repeat }, index) =>
		[index, prev, (prev = prev + (typeof repeat === 'string' ? 1 : repeat || 1))].join('_')
	)
}
export const parseTrackKey = (trackKey: string) =>
	trackKey.split('_').map(Number) as [number, number, number]
const calcLength = (v: IUnit[]) =>
	v.reduce((sum, { repeat }) => sum + (typeof repeat === 'string' ? 1 : repeat || 1), 0)

export const cols$ = Atom.create<IUnit[]>([
	{ ...defaultUnit, id: 'p-col-1', value: '1fr' },
	{ ...defaultUnit, id: 'p-col-2', value: '1fr' },
])

export const colsKeys$ = cols$.view(packTrackKeys)
export const colsLength$ = cols$.view(calcLength)

export const getColByIndex = (index: number) =>
	cols$.lens(Lens.index<IUnit>(index)).lens(Lens.withDefault(defaultUnit))

export const rows$ = Atom.create<IUnit[]>([
	{ ...defaultUnit, id: 'p-row-1', value: '1em' },
	{ ...defaultUnit, id: 'p-row-2', value: 'auto' },
	{ ...defaultUnit, id: 'p-row-3', value: '1em' },
])

export const rowsKeys$ = rows$.view(packTrackKeys)
export const rowsLength$ = rows$.view(calcLength)

export const getRowByIndex = (index: number) =>
	rows$.lens(Lens.index<IUnit>(index)).lens(Lens.withDefault(defaultUnit))

export const grid$ = Atom.create<IGrid>(defaultGrid)
