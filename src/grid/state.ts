import { Atom, Lens } from '@grammarly/focal'
import { defaultUnit, IUnit, IGrid, defaultGrid } from '../_generic/types/common'

const makeArray = (v: any[]) => v.map((_, index) => index)

export const cols$ = Atom.create<IUnit[]>([
	{ id: 'p-col-1', size: '1fr', isEditorOpen: false },
	{ id: 'p-col-2', size: '1fr', isEditorOpen: false },
])

export const colsIDs$ = cols$.view(makeArray)
export const colsLength$ = cols$.view((v) => v.length)

export const getColByIndex = (index: number) =>
	cols$.lens(Lens.index<IUnit>(index)).lens(Lens.withDefault(defaultUnit))

export const rows$ = Atom.create<IUnit[]>([
	{ id: 'p-row-1', size: '1em', isEditorOpen: false },
	{ id: 'p-row-2', size: 'auto', isEditorOpen: false },
	{ id: 'p-row-3', size: '1em', isEditorOpen: false },
])

export const rowsIDs$ = rows$.view(makeArray)
export const rowsLength$ = rowsIDs$.view((v) => v.length)

export const getRowByIndex = (index: number) =>
	rows$.lens(Lens.index<IUnit>(index)).lens(Lens.withDefault(defaultUnit))

export const grid$ = Atom.create<IGrid>(defaultGrid)
