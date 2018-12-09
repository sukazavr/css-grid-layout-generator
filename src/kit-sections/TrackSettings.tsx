import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { HLAddCol, HLAddRow, HLLeave, HLRemoveCol, HLRemoveRow } from '../grid/Highlighter'
import { actionsGrid } from '../_generic/actions'
import { ITrack } from '../_generic/types/common'
import { Btn } from '../_generic/ui/Btn'
import { ShowIf } from '../_generic/ui/ShowIf'
import { Check } from './Check'
import { Control, Section } from './Kit'
import $ from './Kit/style.scss'
import { Size } from './Size'
import { Repeat } from './Repeat'

type TProps = {
	track$: Atom<ITrack>
	row?: true
	start: number
	end: number
	repeat: boolean
}

export const TrackSettings = ({ track$, row, start, end, repeat }: TProps) => {
	const value$ = track$.lens('value')
	const min$ = track$.lens('min')
	const max$ = track$.lens('max')
	const minmax$ = track$.lens('minmax')
	const repeat$ = track$.lens('repeat')
	const addBefore = row ? actionsGrid.addBeforeRow : actionsGrid.addBeforeCol
	const addAfter = row ? actionsGrid.addAfterRow : actionsGrid.addAfterCol
	const remove = row ? actionsGrid.removeRow : actionsGrid.removeCol
	const HLAdd = row ? HLAddRow : HLAddCol
	const HLRemove = row ? HLRemoveRow : HLRemoveCol
	return (
		<>
			<Section>
				<Control>
					<div className={$.btnPanel}>
						<Btn
							ico={row ? 'addBeforeRow' : 'addBeforeCol'}
							transparent
							onMouseOver={HLAdd(start)}
							onMouseOut={HLLeave}
							onClick={addBefore(track$)}
						/>
						<Btn
							ico={row ? 'addAfterRow' : 'addAfterCol'}
							transparent
							onMouseOver={HLAdd(end)}
							onMouseOut={HLLeave}
							onClick={addAfter(track$)}
						/>
						<Btn
							ico={row ? 'removeRow' : 'removeCol'}
							transparent
							onMouseOver={HLRemove({ start, end })}
							onMouseOut={HLLeave}
							onClick={remove(track$)}
						/>
					</div>
				</Control>
			</Section>
			<Section>
				<ShowIf value={minmax$} eq={false}>
					{() => (
						<Control label="Size">
							<Size v$={value$} special flex />
						</Control>
					)}
				</ShowIf>
				<ShowIf value={minmax$} eq={true}>
					{() => (
						<>
							<Control label="Min Size">
								<Size v$={min$} special flex />
							</Control>
							<Control label="Max Size">
								<Size v$={max$} special flex />
							</Control>
						</>
					)}
				</ShowIf>
				<Control>
					<Check v$={minmax$} label="minmax()" />
				</Control>
			</Section>
			{repeat && (
				<Section>
					<Control label="repeat()">
						<Repeat v$={repeat$} />
					</Control>
				</Section>
			)}
		</>
	)
}
