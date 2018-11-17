import { lift } from '@grammarly/focal'
import cc from 'classcat'
import * as React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { actionsItems } from '../../_generic/actions'
import { IItem } from '../../_generic/types/common'
import { Btn } from '../../_generic/ui/Btn'
import { ItemConfig } from '../../overlay-configs/ItemConfig'
import { getItemByIndex } from '../state'
import { Overlay } from '../../_generic/ui/Overlay'
const $ = require('./style.scss')

type TProps = {
	index: number
	item: IItem
}

export const Item = lift(({ index, item }: TProps) => {
	const { id, name } = item
	const item$ = getItemByIndex(index)
	const isEditorOpen$ = item$.lens('isEditorOpen')
	return (
		<Draggable draggableId={id} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={cc([$.item, snapshot.isDragging && $.dragging])}
					onMouseEnter={actionsItems.highlight(item)}
					onMouseLeave={actionsItems.dropHighlight}
				>
					<Overlay
						isOpen$={isEditorOpen$}
						position={['left', 'bottom', 'top', 'right']}
						content={() => <ItemConfig item$={item$} />}
					>
						<div className={$.name} onMouseDown={() => isEditorOpen$.modify((v) => !v)}>
							{name}
						</div>
					</Overlay>
					<div className={$.ctrl}>
						<Btn
							ico="remove"
							icoFill="#8d8e9a"
							transparent
							onClick={actionsItems.del(index)}
						/>
					</div>
				</div>
			)}
		</Draggable>
	)
})
