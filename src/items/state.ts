import { Atom, Lens } from '@grammarly/focal'
import { getColor } from '../_generic/supply/get-color'
import { defaultItem, IItem } from '../_generic/types/common'

const makeArray = (v: any[]) => v.map((_, index) => index)

export const items$ = Atom.create<IItem[]>([
	/* {
		id: 'header',
		name: 'header',
		characters: '',
		color: getColor(),
		isEditorOpen: false,
		colStart: '1',
		rowStart: '1',
		colEnd: '3',
		rowEnd: '2',
		justifySelf: null,
		alignSelf: null,
	},
	{
		id: 'footer',
		name: 'footer',
		characters: '',
		color: getColor(),
		isEditorOpen: false,
		colStart: '1',
		rowStart: '3',
		colEnd: '3',
		rowEnd: '4',
		justifySelf: null,
		alignSelf: null,
	}, */
])

export const itemsIDs$ = items$.view(makeArray)

export const itemsReversed$ = items$.view((items) => [...items].reverse())

export const getItemByIndex = (index: number) =>
	items$.lens(Lens.index<IItem>(index)).lens(Lens.withDefault(defaultItem))
