import { asyncScheduler } from 'rxjs'
import { observeOn } from 'rxjs/operators'
import { actionsAreaSelector } from '../_generic/actions'
import { stateAreaSelector$ } from './state'
import { AUTO, SPAN } from '../overlay-configs/GridItemLocation'

const escapeAreaSelector = (e: KeyboardEvent) => {
	if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
		e.preventDefault()
		actionsAreaSelector.done()
		return false
	}
}

const fromGridItemLocation = (v: string) =>
	v === AUTO ? null : v.includes(SPAN) ? null : Number(v)
const toGridItemLocation = (v: number | null) => (v === null ? AUTO : String(v))

actionsAreaSelector.init.$.subscribe((item$) => {
	item$.modify((item) => {
		const { colStart, rowStart, colEnd, rowEnd } = item
		const endX = fromGridItemLocation(colEnd)
		const endY = fromGridItemLocation(rowEnd)
		stateAreaSelector$.set({
			item$,
			startX: fromGridItemLocation(colStart),
			startY: fromGridItemLocation(rowStart),
			endX: endX ? endX - 1 : endX,
			endY: endY ? endY - 1 : endY,
			isActive: true,
		})
		return { ...item, isEditorOpen: false }
	})
	window.addEventListener('keydown', escapeAreaSelector, true)
})

actionsAreaSelector.done.$.pipe(observeOn(asyncScheduler)).subscribe(() => {
	stateAreaSelector$.modify(({ item$, startX, startY, endX, endY }) => {
		if (item$) {
			item$.modify((item) => ({
				...item,
				colStart: toGridItemLocation(startX),
				rowStart: toGridItemLocation(startY),
				colEnd: toGridItemLocation(endX ? endX + 1 : endX),
				rowEnd: toGridItemLocation(endY ? endY + 1 : endY),
				isEditorOpen: true,
			}))
		}
		return {
			isActive: false,
			item$: null,
			startX: null,
			startY: null,
			endX: null,
			endY: null,
		}
	})
	window.removeEventListener('keydown', escapeAreaSelector, true)
})

actionsAreaSelector.select.$.subscribe(({ x, y }) => {
	stateAreaSelector$.modify((s) => {
		if (s.startX && s.endX) {
			return { ...s, startX: x, startY: y, endX: null, endY: null }
		} else if (s.startX && s.startY) {
			return {
				...s,
				startX: s.startX > x ? x : s.startX,
				startY: s.startY > y ? y : s.startY,
				endX: s.startX > x ? s.startX : x,
				endY: s.startY > y ? s.startY : y,
			}
		} else {
			return { ...s, startX: x, startY: y }
		}
	})
})
