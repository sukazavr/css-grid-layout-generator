import * as React from 'react'
import { gridSettings$ } from '../grid/state'
import { Check } from './Check'
import { Control, Section } from './Kit'
import { Size } from './Size'
import { Select } from './Select'
import { ShowIf } from '../_generic/ui/ShowIf'

const IAJ_OPTIONS = ['start', 'end', 'center', 'stretch']
const CAJ_OPTIONS = [...IAJ_OPTIONS, 'space-around', 'space-between', 'space-evenly']
const AF_OPTIONS = ['row', 'row dense', 'column', 'column dense']

export const GridSettings = () => {
	const isGrow$ = gridSettings$.lens('isGrow')
	return (
		<>
			<Section>
				<Control>
					<Check v$={gridSettings$.lens('isInline')} label="Inline Grid" />
				</Control>
				<Control>
					<Check v$={isGrow$} label="Container Flex Grow" />
				</Control>
				<ShowIf value={isGrow$} eq={false}>
					{() => (
						<>
							<Control label="Container Width">
								<Size v$={gridSettings$.lens('width')} special />
							</Control>
							<Control label="Container Height">
								<Size v$={gridSettings$.lens('height')} special />
							</Control>
						</>
					)}
				</ShowIf>
			</Section>
			<Section>
				<Control label="Justify Items">
					<Select v$={gridSettings$.lens('justifyItems')} options={IAJ_OPTIONS} />
				</Control>
				<Control label="Align Items">
					<Select v$={gridSettings$.lens('alignItems')} options={IAJ_OPTIONS} />
				</Control>
			</Section>
			<Section>
				<Control label="Justify Content">
					<Select v$={gridSettings$.lens('justifyContent')} options={CAJ_OPTIONS} />
				</Control>
				<Control label="Align Content">
					<Select v$={gridSettings$.lens('alignContent')} options={CAJ_OPTIONS} />
				</Control>
			</Section>
			<Section>
				<Control label="Column Gap">
					<Size v$={gridSettings$.lens('colGap')} />
				</Control>
				<Control label="Row Gap">
					<Size v$={gridSettings$.lens('rowGap')} />
				</Control>
			</Section>
			<Section>
				<Control label="Auto Flow">
					<Select v$={gridSettings$.lens('autoFlow')} options={AF_OPTIONS} />
				</Control>
			</Section>
		</>
	)
}
