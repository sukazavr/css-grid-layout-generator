import * as React from 'react'
import { ItemConfig } from '../../overlay-configs/ItemConfig'
import { getItemByIndex } from '../../items/state'
const $ = require('../Shell/style.scss')

const item$ = getItemByIndex(0)

export const WorkSpace = () => {
	return (
		<div className={$.shell}>
			<div>
				<ItemConfig item$={item$} />
			</div>
		</div>
	)
}
