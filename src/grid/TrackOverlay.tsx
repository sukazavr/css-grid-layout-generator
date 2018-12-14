import * as React from 'react'
import { merge } from 'rxjs'
import { shareReplay, startWith } from 'rxjs/operators'
import { TrackSettings } from '../kit-sections/TrackSettings'
import { actionsGrid } from '../_generic/actions'
import { ITrackOverlay } from '../_generic/types/common'
import { MapElement } from '../_generic/ui/MapElement'
import { Overlay } from '../_generic/ui/Overlay'

const state$ = merge(
	actionsGrid.openTrackSettings.$,
	merge(actionsGrid.removeCol.$, actionsGrid.removeRow.$, actionsGrid.closeTrackSettings.$).map(
		() => null
	)
).pipe(
	startWith<ITrackOverlay | null>(null),
	shareReplay(1)
)

const isOpen$ = state$.map(Boolean)

export const trackOverlayID$ = state$.map((s) => s && s.track$.get().id)

export const TrackOverlay = () => (
	<MapElement stream={state$}>
		{(payload) => {
			if (payload) {
				const { rect, ...props } = payload
				return (
					<Overlay
						withArrow={false}
						isOpen$={isOpen$}
						position={[props.row ? 'right' : 'bottom']}
						align="start"
						close={actionsGrid.closeTrackSettings}
						content={() => <TrackSettings {...props} />}
					>
						<div
							style={{
								position: 'absolute',
								left: rect.left,
								top: rect.top,
								width: rect.width,
								height: rect.height,
								pointerEvents: 'none',
							}}
						/>
					</Overlay>
				)
			} else {
				return null
			}
		}}
	</MapElement>
)
