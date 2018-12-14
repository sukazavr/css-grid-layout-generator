import { Atom } from '@grammarly/focal'
import cc from 'classcat'
import * as React from 'react'
import { Subscription } from 'rxjs'
import { AreaSelector } from '../area-selector'
import { actionsGrid } from '../_generic/actions'
import { IGrid } from '../_generic/types/common'
import { ShowIf } from '../_generic/ui/ShowIf'
import { Highlighter } from './Highlighter'
import { calcLength, createTrack, removeTrack } from './state'
import $ from './style.scss'
import { TrackOverlay } from './TrackOverlay'
import { Tracks } from './Tracks'

type TProps = {
	grid$: Atom<IGrid>
	repeat: boolean
}

// tslint:disable:max-line-length
export class Grid extends React.PureComponent<TProps> {
	subs: Subscription[]
	cols$ = this.props.grid$.lens('cols')
	rows$ = this.props.grid$.lens('rows')
	componentDidMount() {
		this.subs = [
			actionsGrid.removeRow.$.subscribe(removeTrack(this.rows$)),
			actionsGrid.addRow.$.subscribe(createTrack(this.rows$, true, false)),
			actionsGrid.addAfterRow.$.subscribe(createTrack(this.rows$, true, true)),
			actionsGrid.addBeforeRow.$.subscribe(createTrack(this.rows$, true, false)),
			actionsGrid.removeCol.$.subscribe(removeTrack(this.cols$)),
			actionsGrid.addCol.$.subscribe(createTrack(this.cols$, false, false)),
			actionsGrid.addAfterCol.$.subscribe(createTrack(this.cols$, false, true)),
			actionsGrid.addBeforeCol.$.subscribe(createTrack(this.cols$, false, false)),
		]
	}
	componentWillUnmount() {
		this.subs.forEach((sub) => sub.unsubscribe())
	}
	render() {
		const repeat = this.props.repeat
		const colsLength$ = this.cols$.view(calcLength)
		const rowsLength$ = this.rows$.view(calcLength)
		return (
			<div className={$.container}>
				{/* <Overlay
					isOpen$={isGridConfigOpen$}
					position={['right', 'bottom', 'left', 'top']}
					content={() => <GridConfig gridSettings$={gridSettings$} />}
				>
					<F.div
						{...classes($.config, blindByAreaSelector$)}
						onClick={() => isGridConfigOpen$.set(true)}
					>
						<svg viewBox="0 0 40 40">
							<path d="m25.9 20q0-2.4-1.7-4t-4.1-1.7-4 1.7-1.7 4 1.7 4 4 1.7 4.1-1.7 1.7-4z m11.4-2.4v4.9q0 0.3-0.2 0.5t-0.4 0.3l-4.2 0.6q-0.4 1.3-0.8 2.1 0.7 1.1 2.3 3.1 0.3 0.2 0.3 0.5t-0.2 0.5q-0.6 0.9-2.2 2.4t-2.1 1.6q-0.3 0-0.6-0.2l-3.1-2.4q-1 0.5-2 0.9-0.4 3-0.7 4.1-0.1 0.6-0.8 0.6h-4.9q-0.3 0-0.6-0.1t-0.2-0.5l-0.7-4.1q-1.1-0.4-2-0.9l-3.1 2.4q-0.2 0.2-0.6 0.2-0.3 0-0.5-0.2-2.8-2.6-3.7-3.8-0.2-0.2-0.2-0.5 0-0.2 0.2-0.5 0.3-0.5 1.1-1.5t1.2-1.5q-0.6-1.2-0.9-2.3l-4.1-0.6q-0.2 0-0.4-0.2t-0.2-0.6v-4.9q0-0.3 0.2-0.5t0.4-0.3l4.2-0.7q0.3-1 0.8-2-0.9-1.3-2.4-3.1-0.2-0.3-0.2-0.5 0-0.2 0.2-0.5 0.6-0.8 2.2-2.4t2.1-1.6q0.3 0 0.6 0.2l3.1 2.4q1-0.5 2-0.9 0.4-3 0.7-4.1 0.1-0.6 0.8-0.6h4.9q0.3 0 0.6 0.1t0.2 0.5l0.7 4.1q1 0.4 2 0.9l3.1-2.4q0.2-0.2 0.6-0.2 0.3 0 0.5 0.2 2.9 2.6 3.7 3.8 0.2 0.2 0.2 0.5 0 0.2-0.2 0.5-0.4 0.5-1.2 1.5t-1.2 1.5q0.6 1.2 1 2.2l4 0.7q0.3 0 0.5 0.2t0.2 0.6z" />
						</svg>
					</F.div>
				</Overlay> */}
				<ShowIf value={colsLength$} eq={0}>
					{() => (
						<div
							className={cc([$.col, $.spring])}
							style={{ gridColumnStart: 2, animationDelay: '1s' }}
							onClick={actionsGrid.addCol}
						>
							<span>Add Column</span>
						</div>
					)}
				</ShowIf>
				<ShowIf value={rowsLength$} eq={0}>
					{() => (
						<div
							className={cc([$.row, $.spring])}
							style={{ gridRowStart: 2 }}
							onClick={actionsGrid.addRow}
						>
							<span>Add Row</span>
						</div>
					)}
				</ShowIf>
				<Tracks tracks$={this.cols$} repeat={repeat} row={false} />
				<Tracks tracks$={this.rows$} repeat={repeat} row={true} />
				<AreaSelector colsLength$={colsLength$} rowsLength$={rowsLength$} />
				<Highlighter colsLength$={colsLength$} rowsLength$={rowsLength$} />
				<TrackOverlay />
			</div>
		)
	}
}
