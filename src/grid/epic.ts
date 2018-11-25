import { actionsGrid } from '../_generic/actions'
import { IUnit, defaultUnit } from '../_generic/types/common'
import { cols$, rows$ } from './state'
import { Atom } from '@grammarly/focal'

let counter = 1
const createUnit = (row: boolean, after: boolean) => (unit$: Atom<IUnit>) => {
	const track$ = row ? rows$ : cols$
	track$.modify((track) => {
		const nextTrack = [...track]
		const pos = unit$.get ? track.indexOf(unit$.get()) + (after ? 1 : 0) : track.length
		nextTrack.splice(pos, 0, {
			...defaultUnit,
			id: `${row ? 'row' : 'col'}-${counter++}`,
			value: row ? 'auto' : '1fr',
		})
		return nextTrack
	})
}
const removeUnit = (row: boolean) => (unit$: Atom<IUnit>) => {
	const track$ = row ? rows$ : cols$
	track$.modify((track) => {
		const nextTrack = [...track]
		const pos = track.indexOf(unit$.get())
		nextTrack.splice(pos, 1)
		return nextTrack
	})
}

actionsGrid.addRow.$.subscribe(createUnit(true, false))
actionsGrid.addCol.$.subscribe(createUnit(false, false))
actionsGrid.addBeforeRow.$.subscribe(createUnit(true, false))
actionsGrid.addAfterRow.$.subscribe(createUnit(true, true))
actionsGrid.addBeforeCol.$.subscribe(createUnit(false, false))
actionsGrid.addAfterCol.$.subscribe(createUnit(false, true))
actionsGrid.removeRow.$.subscribe(removeUnit(true))
actionsGrid.removeCol.$.subscribe(removeUnit(false))
