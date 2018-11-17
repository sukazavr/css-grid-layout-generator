import { actionsGrid } from '../_generic/actions'
import { IUnit } from '../_generic/types/common'
import { cols$, rows$ } from './state'

let counter = 1

actionsGrid.add.$.subscribe(({ pos, isR }) => {
	const lines$ = isR ? rows$ : cols$
	lines$.modify((lines) => {
		const newUnit: IUnit = {
			id: `${isR ? 'row' : 'col'}-${counter++}`,
			size: isR ? 'auto' : '1fr',
			isEditorOpen: false,
		}
		const nextLines = [...lines]
		nextLines.splice(pos, 0, newUnit)
		return nextLines
	})
})

actionsGrid.del.$.subscribe(({ pos, isR }) => {
	const lines$ = isR ? rows$ : cols$
	lines$.modify((lines) => {
		const nextLines = [...lines]
		nextLines.splice(pos, 1)
		return nextLines
	})
})
