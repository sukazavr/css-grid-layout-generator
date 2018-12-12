import * as React from 'react'
import { gridSettings$ } from '../grid/state'
import { Check } from './Check'
import { Control, Section } from './Kit'
import { Size } from './Size'
import { Select } from './Select'
import { ShowIf } from '../_generic/ui/ShowIf'
import {
	tipContainerFlexGrow,
	tipInlineGrid,
	tipJustifyItems,
	tipAlignItems,
	tipJustifyContent,
	tipAlignContent,
	tipAutoFlow,
	tipGap,
} from '../tips'

const IAJ_OPTIONS = ['start', 'end', 'center', 'stretch']
const CAJ_OPTIONS = [...IAJ_OPTIONS, 'space-around', 'space-between', 'space-evenly']
const AF_OPTIONS = ['row', 'row dense', 'column', 'column dense']

export const GridSettings = () => {
	const isGrow$ = gridSettings$.lens('isGrow')
	return (
		<>
			<Section>
				<Control tip={tipInlineGrid}>
					<Check v$={gridSettings$.lens('isInline')} label="Inline Grid" />
				</Control>
				<Control tip={tipContainerFlexGrow}>
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
				<Control label="Justify Items" tip={tipJustifyItems}>
					<Select v$={gridSettings$.lens('justifyItems')} options={IAJ_OPTIONS} />
				</Control>
				<Control label="Align Items" tip={tipAlignItems}>
					<Select v$={gridSettings$.lens('alignItems')} options={IAJ_OPTIONS} />
				</Control>
			</Section>
			<Section>
				<Control label="Justify Content" tip={tipJustifyContent}>
					<Select v$={gridSettings$.lens('justifyContent')} options={CAJ_OPTIONS} />
				</Control>
				<Control label="Align Content" tip={tipAlignContent}>
					<Select v$={gridSettings$.lens('alignContent')} options={CAJ_OPTIONS} />
				</Control>
			</Section>
			<Section>
				<Control label="Column Gap" tip={tipGap}>
					<Size v$={gridSettings$.lens('colGap')} />
				</Control>
				<Control label="Row Gap">
					<Size v$={gridSettings$.lens('rowGap')} />
				</Control>
			</Section>
			<Section>
				<Control label="Auto Flow" tip={tipAutoFlow}>
					<Select v$={gridSettings$.lens('autoFlow')} options={AF_OPTIONS} />
				</Control>
			</Section>
		</>
	)
}
