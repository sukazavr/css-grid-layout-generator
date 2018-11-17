import { ca, ga, generalActionsLog$ } from '../supply/action-helpers'
import { IItem } from '../types/common'
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

type TUnitDir = {
	isR?: true
	pos: number
}

export const actionsGrid = ga('grid', {
	add: ca<TUnitDir, TUnitDir, () => void>((R, ud) => () => R(ud)),
	del: ca<TUnitDir, TUnitDir, () => void>((R, ud) => () => R(ud)),
})

export const actionsItems = ga('items', {
	add: ca(),
	del: ca<number, number, () => void>((R, index) => () => R(index)),
	reorder: ca<{ currentIndex: number; nextIndex: number }>(),
	highlight: ca<IItem, IItem, () => void>((R, item) => () => R(item)),
	dropHighlight: ca(),
	closeAllEditors: ca(),
})

export const actionsAreaSelector = ga('area-selector', {
	init: ca<Atom<IItem>>(),
	done: ca(),
	select: ca<{ x: number; y: number }, { x: number; y: number }, () => void>((R, coors) => () =>
		R(coors)
	),
})
