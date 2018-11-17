import { actionsItems } from '../_generic/actions'
import { IItem } from '../_generic/types/common'
import { items$ } from './state'
import { getColor } from '../_generic/supply/get-color'

let counter = 1

actionsItems.add.$.subscribe(() => {
	items$.modify((items) => {
		const id = `item-${counter++}`
		const newItem: IItem = {
			id,
			name: id,
			characters: '',
			color: getColor(),
			colStart: 'auto',
			rowStart: 'auto',
			colEnd: 'auto',
			rowEnd: 'auto',
			justifySelf: null,
			alignSelf: null,
			isEditorOpen: true,
		}
		return [
			newItem,
			...items.map((item) => (item.isEditorOpen ? { ...item, isEditorOpen: false } : item)),
		]
	})
})

actionsItems.del.$.subscribe((index) => {
	items$.modify((items) => {
		const nextItems = [...items]
		nextItems.splice(index, 1)
		return nextItems
	})
})

actionsItems.reorder.$.subscribe(({ currentIndex, nextIndex }) => {
	items$.modify((items) => {
		if (currentIndex === nextIndex) {
			return items
		} else {
			const nextItems = [...items]
			const [removed] = nextItems.splice(currentIndex, 1)
			nextItems.splice(nextIndex, 0, removed)
			return nextItems
		}
	})
})
