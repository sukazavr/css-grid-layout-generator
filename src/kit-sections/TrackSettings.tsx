import { Atom, Lens, ReadOnlyAtom } from '@grammarly/focal'
import * as React from 'react'
import { HLAddCol, HLAddRow, HLLeave, HLRemoveCol, HLRemoveRow } from '../grid/Highlighter'
import { tipFitContent, tipMinmax, tipRepeat } from '../tips'
import { actionsGrid } from '../_generic/actions'
import { ITrack } from '../_generic/types/common'
import { Btn } from '../_generic/ui/Btn'
import { ShowIf } from '../_generic/ui/ShowIf'
import { Check } from './Check'
import { Control, Section } from './Kit'
import $ from './Kit/style.scss'
import { Repeat } from './Repeat'
import { Size } from './Size'

type TProps = {
	track$: Atom<ITrack>
	position$: ReadOnlyAtom<[number, number]>
	row: boolean
	repeat: boolean
}

export const TrackSettings = ({ track$, position$, row, repeat }: TProps) => {
	const value$ = track$.lens('value')
	const min$ = track$.lens('min')
	const max$ = track$.lens('max')
	const minmax$ = track$.lens(makeMonoLens('minmax', 'fitContent'))
	const fitContent$ = track$.lens(makeMonoLens('fitContent', 'minmax'))
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
							onMouseOver={() => HLAdd(position$.get()[0])}
							onMouseOut={HLLeave}
							onClick={addBefore(track$)}
						/>
						<Btn
							ico={row ? 'removeRow' : 'removeCol'}
							transparent
							onMouseOver={() => HLRemove(position$.get())}
							onMouseOut={HLLeave}
							onClick={remove(track$)}
						/>
						<Btn
							ico={row ? 'addAfterRow' : 'addAfterCol'}
							transparent
							onMouseOver={() => HLAdd(position$.get()[1])}
							onMouseOut={HLLeave}
							onClick={addAfter(track$)}
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
				<Control tip={tipMinmax}>
					<Check v$={minmax$} label="minmax()" />
				</Control>
				<Control tip={tipFitContent}>
					<Check v$={fitContent$} label="fit-content()" />
				</Control>
			</Section>
			{repeat && (
				<Section>
					<Control label="repeat()" tip={tipRepeat}>
						<Repeat v$={repeat$} />
					</Control>
				</Section>
			)}
		</>
	)
}

const makeMonoLens = (orig: string, reflection: string) =>
	Lens.create(
		(track: ITrack) => track[orig] as boolean,
		(value, track) => ({ ...track, [orig]: value, [reflection]: track[reflection] && false })
	)
