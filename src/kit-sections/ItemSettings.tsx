import * as React from 'react'
import { selectedItem$ } from '../items/state'
import { Characters } from './Characters'
import { Color } from './Color'
import { Control, Section } from './Kit'
import { Location } from './Location'
import { Name } from './Name'
import { Select } from './Select'
import { tipJustifySelf, tipAlignSelf } from '../tips'

const SAJ_OPTIONS = ['start', 'end', 'center', 'stretch']

export const ItemSettings = () => {
	return (
		<>
			<Section>
				<Control label="Name">
					<Name v$={selectedItem$.lens('name')} />
				</Control>
			</Section>
			<Section>
				<Control label="Column Start">
					<Location v$={selectedItem$.lens('colStart')} />
				</Control>
				<Control label="Column End">
					<Location v$={selectedItem$.lens('colEnd')} />
				</Control>
				<Control label="Row Start">
					<Location v$={selectedItem$.lens('rowStart')} />
				</Control>
				<Control label="Row End">
					<Location v$={selectedItem$.lens('rowEnd')} />
				</Control>
			</Section>
			<Section>
				<Control label="Justify Self" tip={tipJustifySelf}>
					<Select v$={selectedItem$.lens('justifySelf')} options={SAJ_OPTIONS} />
				</Control>
				<Control label="Align Self" tip={tipAlignSelf}>
					<Select v$={selectedItem$.lens('alignSelf')} options={SAJ_OPTIONS} />
				</Control>
			</Section>
			<Section>
				<Control label="Background Color">
					<Color v$={selectedItem$.lens('color')} />
				</Control>
				<Control label="Inner Text Amount">
					<Characters v$={selectedItem$.lens('characters')} />
				</Control>
			</Section>
		</>
	)
}
