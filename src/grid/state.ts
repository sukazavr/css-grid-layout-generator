import { Atom, Lens } from '@grammarly/focal'
import { NTA } from '../_generic/supply/utils'
import {
	defaultGridSettings,
	defaultTrack,
	IGrid,
	IGridSettings,
	ITrack,
} from '../_generic/types/common'

export const gridSettings$ = Atom.create<IGridSettings>(defaultGridSettings)

export const explicitGrid$ = Atom.create<IGrid>({
	cols: [
		{ ...defaultTrack, id: 'p-col-1', value: '1fr' },
		{ ...defaultTrack, id: 'p-col-2', value: '1fr' },
	],
	rows: [
		{ ...defaultTrack, id: 'p-row-1', value: '1fr' },
		{ ...defaultTrack, id: 'p-row-2', value: '1fr' },
	],
})

export const implicitGrid$ = Atom.create<IGrid>({
	cols: [],
	rows: [],
})

export const calcLength = (v: ITrack[]) =>
	v.reduce((sum, { repeat }) => sum + (typeof repeat === 'string' ? 1 : repeat || 1), 0)

export const tracksPosition = (v: ITrack[]) => {
	let prev = 2
	return v.reduce<{ [trackID: string]: [number, number] }>((acc, { id, repeat }) => {
		acc[id] = [prev, (prev = prev + (typeof repeat === 'string' ? 1 : repeat || 1))]
		return acc
	}, {})
}

export const trackTitle = ({ value, min, max, minmax, fitContent, repeat }: ITrack) => {
	let title: string
	if (minmax) {
		title = `${NTA(min)}→${NTA(max)}`
	} else if (fitContent) {
		title = `fit(${NTA(value)})`
	} else {
		title = NTA(value)
	}
	if (repeat) {
		title = `${repeat}${typeof repeat === 'number' ? '×' : ''} ${title}`
	}
	return title
}

export const getTrackByIndex = (tracks$: Atom<ITrack[]>, index: number) =>
	tracks$.lens(Lens.index<ITrack>(index)).lens(Lens.withDefault(defaultTrack))

export const getTrackByID = (tracks$: Atom<ITrack[]>, id: string) =>
	tracks$.lens(
		Lens.create(
			(tracks: ITrack[]) => tracks.find((track) => track.id === id) || defaultTrack,
			(track, tracks) => {
				const tID = track.id
				const index = tracks.findIndex((t) => t.id === tID)
				if (index === -1) {
					return tracks
				} else {
					const nextTracks = [...tracks]
					nextTracks.splice(index, 1, track)
					return nextTracks
				}
			}
		)
	)

let counter = 1
export const createTrack = (tracks$: Atom<ITrack[]>, row: boolean, after: boolean) => (
	track$: Atom<ITrack>
) => {
	tracks$.modify((tracks) => {
		const nextTrack = [...tracks]
		const pos = track$.get ? tracks.indexOf(track$.get()) + (after ? 1 : 0) : tracks.length
		nextTrack.splice(pos, 0, {
			...defaultTrack,
			id: `${row ? 'row' : 'col'}-${counter++}`,
			value: row ? null : '1fr',
		})
		return nextTrack
	})
}

export const removeTrack = (tracks$: Atom<ITrack[]>) => (track$: Atom<ITrack>) => {
	tracks$.modify((track) => {
		const nextTrack = [...track]
		const pos = track.indexOf(track$.get())
		nextTrack.splice(pos, 1)
		return nextTrack
	})
}
