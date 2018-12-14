import { Atom, classes, F, Lens, reactiveList } from '@grammarly/focal'
import * as React from 'react'
import { actionsGrid } from '../_generic/actions'
import { ITrack } from '../_generic/types/common'
import { MapElement } from '../_generic/ui/MapElement'
import { getTrackByID, tracksPosition, trackTitle } from './state'
import $ from './style.scss'
import { trackOverlayID$ } from './TrackOverlay'

type TProps = {
	tracks$: Atom<ITrack[]>
	repeat: boolean
	row: boolean
}

export const Tracks = ({ tracks$, repeat, row }: TProps) => {
	const tracksPosition$ = tracks$.view(tracksPosition)
	return (
		<MapElement
			stream={reactiveList(tracks$.view((tracks) => tracks.map(({ id }) => id)), (id) => {
				const track$ = getTrackByID(tracks$, id)
				const title$ = track$.view(trackTitle)
				const position$ = tracksPosition$
					.view(Lens.key(id))
					.view(Lens.withDefault<[number, number]>([0, 0]))
				return (
					<F.div
						key={id}
						{...classes(
							row ? $.row : $.col,
							trackOverlayID$.map((tid) => tid && tid === id && $.active)
						)}
						style={position$.view(([start, end]) => ({
							[row ? 'gridRowStart' : 'gridColumnStart']: start,
							[row ? 'gridRowEnd' : 'gridColumnEnd']: end,
						}))}
						onClick={(e) => {
							actionsGrid.openTrackSettings({
								track$,
								position$,
								row,
								repeat,
								rect: e.currentTarget.getBoundingClientRect(),
							})
						}}
					>
						<F.span>{title$}</F.span>
					</F.div>
				)
			})}
		/>
	)
}
