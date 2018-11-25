import { ca, ga, generalActionsLog$ } from '../supply/action-helpers'
import { IItem, IUnit } from '../types/common'
import { Atom } from '@grammarly/focal'

if (process.env.NODE_ENV !== 'production') {
	generalActionsLog$.subscribe(({ key, namespace, payload }) => {
		// tslint:disable:no-console
		console.group('🔷', key, '🔹', namespace)
		console.log(payload)
		console.groupEnd()
	})
}

export const actionsShell = ga('shell', {
	_mounted: ca(),
})

export const actionsGrid = ga('grid', {
	addCol: ca(),
	addBeforeCol: ca<Atom<IUnit>>(null),
	addAfterCol: ca<Atom<IUnit>>(null),
	removeCol: ca<Atom<IUnit>>(null),
	addRow: ca(),
	addBeforeRow: ca<Atom<IUnit>>(null),
	addAfterRow: ca<Atom<IUnit>>(null),
	removeRow: ca<Atom<IUnit>>(null),
})

export const actionsItems = ga('items', {
	add: ca(),
	del: ca<number>(null),
	reorder: ca<{ currentIndex: number; nextIndex: number }>(),
	highlight: ca<IItem>(null),
	dropHighlight: ca(),
	closeAllEditors: ca(),
})

export const actionsAreaSelector = ga('area-selector', {
	init: ca<Atom<IItem>>(),
	done: ca(),
	select: ca<{ x: number; y: number }>(null),
})
