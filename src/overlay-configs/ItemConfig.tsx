import { Button, Label } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { actionsAreaSelector } from '../_generic/actions'
import { IItem } from '../_generic/types/common'
import { GridItemLocation } from './GridItemLocation'
import { GridPropSelect } from './GridPropSelect'
import { GridItemCharacters } from './GridItemCharacters'
import { GridItemColor } from './GridItemColor'
import { GridItemName } from './GridItemName'
const $ = require('../_generic/ui/Overlay/style.scss')

type TProps = {
	item$: Atom<IItem>
}

const SAJ_OPTIONS = ['start', 'end', 'center', 'stretch']

export const ItemConfig = ({ item$ }: TProps) => {
	return (
		<div
			style={{
				width: 'max-content',
			}}
		>
			<div className={$.group}>
				<div className={$.split}>
					<div>
						<Label>Column Start</Label>
						<GridItemLocation v$={item$.lens('colStart')} />
					</div>
					<div>
						<Label>Column End</Label>
						<GridItemLocation v$={item$.lens('colEnd')} />
					</div>
				</div>
				<div className={$.space} />
				<div className={$.split}>
					<div>
						<Label>Row Start</Label>
						<GridItemLocation v$={item$.lens('rowStart')} />
					</div>
					<div>
						<Label>Row End</Label>
						<GridItemLocation v$={item$.lens('rowEnd')} />
					</div>
				</div>
				<div className={$.space} />
				<Button text="Select Area" onClick={() => actionsAreaSelector.init(item$)} />
			</div>
			<div className={$.space} />
			<div className={$.group}>
				<div className={$.split}>
					<div>
						<Label>Justify Self</Label>
						<GridPropSelect v$={item$.lens('justifySelf')} options={SAJ_OPTIONS} />
					</div>
					<div>
						<Label>Align Self</Label>
						<GridPropSelect v$={item$.lens('alignSelf')} options={SAJ_OPTIONS} />
					</div>
				</div>
			</div>
			<div className={$.space} />
			<div className={$.group}>
				<GridItemName v$={item$.lens('name')} />
				<div>
					<Label>Background Color</Label>
					<GridItemColor v$={item$.lens('color')} />
				</div>
				<div className={$.space} />
				<div>
					<Label>Inner Text Amount</Label>
					<GridItemCharacters v$={item$.lens('characters')} />
				</div>
			</div>
		</div>
	)
}
