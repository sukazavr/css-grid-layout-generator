import { Atom } from '@grammarly/focal'

export interface IGridSettings {
	isInline: boolean
	width: string | null
	height: string | null
	colGap: string | null
	rowGap: string | null
	justifyItems: string | null
	alignItems: string | null
	justifyContent: string | null
	alignContent: string | null
	autoFlow: string | null
	isGrow: boolean
	isGuided: boolean
	isEditorOpen: boolean
}

export const defaultGridSettings: IGridSettings = {
	isInline: false,
	width: null,
	height: null,
	colGap: '1em',
	rowGap: '1em',
	justifyItems: null,
	alignItems: null,
	justifyContent: null,
	alignContent: null,
	autoFlow: null,
	isGrow: true,
	isGuided: true,
	isEditorOpen: false,
}

export interface IGrid {
	cols: IUnit[]
	rows: IUnit[]
}

export interface IUnit {
	id: string
	value: string
	min: string
	max: string
	minmax: boolean
	repeat: string | number
	isEditorOpen: boolean
}

export const defaultUnit: IUnit = {
	id: 'def-unit',
	value: 'auto',
	min: '0px',
	max: '1fr',
	minmax: false,
	repeat: 0,
	isEditorOpen: false,
}

export interface IItem {
	id: string
	name: string
	characters: string
	color: string
	colStart: string
	rowStart: string
	colEnd: string
	rowEnd: string
	justifySelf: string | null
	alignSelf: string | null
	isEditorOpen: boolean
}

export const defaultItem: IItem = {
	id: 'def-item',
	name: 'def-item',
	characters: '',
	color: 'red',
	colStart: 'auto',
	rowStart: 'auto',
	colEnd: 'auto',
	rowEnd: 'auto',
	justifySelf: null,
	alignSelf: null,
	isEditorOpen: false,
}

export interface IActiveSelector {
	isActive: boolean
	item$: Atom<IItem> | null
	startX: number | null
	startY: number | null
	endX: number | null
	endY: number | null
}
