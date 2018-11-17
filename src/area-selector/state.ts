import { Atom } from '@grammarly/focal'
import { IActiveSelector } from '../_generic/types/common'
import './epic'

export const stateAreaSelector$ = Atom.create<IActiveSelector>({
	isActive: false,
	item$: null,
	startX: null,
	startY: null,
	endX: null,
	endY: null,
})

export const isActiveAreaSelector$ = stateAreaSelector$.view('isActive')

export const titleOfAreaSelector$ = stateAreaSelector$.view(
	({ item$ }) => (item$ ? `Select Area for "${item$.get().name}"` : null)
)

export const blindByAreaSelector$ = stateAreaSelector$.view((s) => s.isActive && 'blinded')
