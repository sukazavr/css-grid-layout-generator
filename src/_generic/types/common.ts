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
}

export const defaultGridSettings: IGridSettings = {
	isInline: false,
	width: '10em',
	height: '10em',
	colGap: '1em',
	rowGap: '1em',
	justifyItems: null,
	alignItems: null,
	justifyContent: null,
	alignContent: null,
	autoFlow: null,
	isGrow: true,
}

export interface IGrid {
	cols: ITrack[]
	rows: ITrack[]
}

export interface ITrack {
	id: string
	value: string | null
	min: string | null
	max: string | null
	minmax: boolean
	fitContent: boolean
	repeat: string | number
	isEditorOpen: boolean
}

export const defaultTrack: ITrack = {
	id: 'def-track',
	value: null,
	min: '1px',
	max: '1fr',
	minmax: false,
	fitContent: false,
	repeat: 0,
	isEditorOpen: false,
}

export interface IItem {
	id: string
	name: string
	characters: string
	color: string
	colStart: string | number
	rowStart: string | number
	colEnd: string | number
	rowEnd: string | number
	justifySelf: string | null
	alignSelf: string | null
	isHidden: boolean
}

export const defaultItem: IItem = {
	id: 'def-item',
	name: 'def-item',
	characters: '',
	color: 'red',
	colStart: 1,
	rowStart: 1,
	colEnd: 2,
	rowEnd: 2,
	justifySelf: null,
	alignSelf: null,
	isHidden: false,
}
