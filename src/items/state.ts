import { Atom, Lens } from '@grammarly/focal'
import { getColor } from '../_generic/supply/get-color'
import { defaultItem, IItem } from '../_generic/types/common'
import { actionsItems } from '../_generic/actions'

type TState = {
	selectedID: null | string
	items: IItem[]
}

const state$ = Atom.create<TState>({
	selectedID: null,
	items: [],
})

export const selectedID$ = state$.lens('selectedID')

export const items$ = state$.lens('items')

export const itemsIDs$ = items$.view((v) => v.map((_, index) => index))

export const itemsReversed$ = items$.lens(
	Lens.create((items: IItem[]) => [...items].reverse(), (nextItems) => [...nextItems].reverse())
)

export const getItemByIndex = (index: number) =>
	items$.lens(Lens.index<IItem>(index)).lens(Lens.withDefault(defaultItem))

export const selectedItem$ = state$.lens(
	Lens.create(
		({ selectedID, items }: TState) => {
			return (selectedID && items.find(({ id }) => id === selectedID)) || createItem()
		},
		(item, { items }) => {
			const id = item.id
			const index = items.findIndex((i) => i.id === id)
			const nextItems = [...items]
			if (index === -1) {
				nextItems.unshift(item)
			} else {
				nextItems.splice(index, 1, item)
			}
			return { selectedID: id, items: nextItems }
		}
	)
)

let counter = 1
const createItem = () => {
	const id = `item-${counter++}`
	const newItem: IItem = {
		id,
		name: id,
		characters: '',
		color: getColor(),
		colStart: 1,
		rowStart: 1,
		colEnd: 2,
		rowEnd: 2,
		justifySelf: null,
		alignSelf: null,
	}
	return newItem
}

actionsItems.add.$.subscribe(() => {
	state$.modify(({ items }) => {
		const item = createItem()
		return {
			selectedID: item.id,
			items: [item, ...items],
		}
	})
})

actionsItems.del.$.subscribe((index) => {
	state$.modify(({ selectedID, items }) => {
		const nextItems = [...items]
		const deletedID = nextItems.splice(index, 1)[0].id
		return {
			selectedID: selectedID === deletedID ? null : selectedID,
			items: nextItems,
		}
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

actionsItems.select.$.subscribe((itemID) => {
	selectedID$.set(itemID)
})
