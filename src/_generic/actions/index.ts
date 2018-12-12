import { ca, ga, generalActionsLog$ } from '../supply/action-helpers'
import { IItem, ITrack } from '../types/common'
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
	getCode: ca(),
})

export const actionsGrid = ga('grid', {
	addCol: ca(),
	addBeforeCol: ca<Atom<ITrack>>(null),
	addAfterCol: ca<Atom<ITrack>>(null),
	removeCol: ca<Atom<ITrack>>(null),
	addRow: ca(),
	addBeforeRow: ca<Atom<ITrack>>(null),
	addAfterRow: ca<Atom<ITrack>>(null),
	removeRow: ca<Atom<ITrack>>(null),
})

export const actionsItems = ga('items', {
	add: ca(),
	del: ca<number>(null),
	reorder: ca<{ currentIndex: number; nextIndex: number }>(),
	select: ca<string>(), // item.id
	toggleVision: ca<number>(null), // item index
	highlight: ca<string>(null), // item.name
	dropHighlight: ca(),
})
