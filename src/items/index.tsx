import { F, reactiveList } from '@grammarly/focal'
import * as React from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { shareReplay } from 'rxjs/operators'
import { actionsItems } from '../_generic/actions'
import { Btn } from '../_generic/ui/Btn'
import './epic'
import { Item } from './Item'
import { getItemByIndex, itemsIDs$ } from './state'
import $ from './style.scss'

const list$ = reactiveList(itemsIDs$, (index) => {
	const item$ = getItemByIndex(index)
	return <Item key={index} index={index} item={item$} />
}).pipe(
	// shareReplay need to be here to do not rerender the list while dragging
	shareReplay(1)
)

export const Items = () => (
	<div className={$.container}>
		<Btn label="Add Grid Item" onClick={actionsItems.add} />
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(provided) => (
					<F.div className={$.list} mount={provided.innerRef}>
						{list$}
						{provided.placeholder}
					</F.div>
				)}
			</Droppable>
		</DragDropContext>
	</div>
)

const onDragEnd = (result: DropResult) => {
	if (result.destination) {
		actionsItems.reorder({
			currentIndex: result.source.index,
			nextIndex: result.destination.index,
		})
	}
}
