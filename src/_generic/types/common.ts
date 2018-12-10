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
	repeat: string | number
	isEditorOpen: boolean
}

export const defaultTrack: ITrack = {
	id: 'def-track',
	value: null,
	min: '1px',
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
	colStart: string | number
	rowStart: string | number
	colEnd: string | number
	rowEnd: string | number
	justifySelf: string | null
	alignSelf: string | null
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
}
