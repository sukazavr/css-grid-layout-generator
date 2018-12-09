import { Atom } from '@grammarly/focal'
import {
	defaultGridSettings,
	defaultTrack,
	IGrid,
	IGridSettings,
	ITrack,
} from '../_generic/types/common'

export const calcLength = (v: ITrack[]) =>
	v.reduce((sum, { repeat }) => sum + (typeof repeat === 'string' ? 1 : repeat || 1), 0)
export const packTrackKeys = (v: ITrack[]) => {
	let prev = 2
	return v.map(({ repeat }, index) =>
		[index, prev, (prev = prev + (typeof repeat === 'string' ? 1 : repeat || 1))].join('_')
	)
}
export const parseTrackKey = (trackKey: string) =>
	trackKey.split('_').map(Number) as [number, number, number]

export const gridSettings$ = Atom.create<IGridSettings>(defaultGridSettings)

export const explicitGrid$ = Atom.create<IGrid>({
	cols: [
		/* { ...defaultTrack, id: 'p-col-1', value: '1fr' },
		{ ...defaultTrack, id: 'p-col-2', value: '1fr' }, */
	],
	rows: [
		/* { ...defaultTrack, id: 'p-row-1', value: '1em' },
		{ ...defaultTrack, id: 'p-row-2', value: null },
		{ ...defaultTrack, id: 'p-row-3', value: '1em' }, */
	],
})

export const implicitGrid$ = Atom.create<IGrid>({
	cols: [],
	rows: [],
})
