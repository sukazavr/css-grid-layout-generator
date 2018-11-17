import * as React from 'react'
import { ItemConfig } from '../../overlay-configs/ItemConfig'
import { getItemByIndex } from '../../items/state'
import { getColByIndex } from '../../grid/state'
import { UnitConfig } from '../../overlay-configs/UnitConfig'
const $ = require('../Shell/style.scss')

const item$ = getItemByIndex(0)
const unit$ = getColByIndex(0)
unit$.subscribe(console.log)

export const WorkSpace = () => {
	return (
		<div className={$.shell}>
			<div>
				<ItemConfig item$={item$} />
			</div>
			<div>
				<UnitConfig unit$={unit$} />
			</div>
		</div>
	)
}
