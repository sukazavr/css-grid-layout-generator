import { Atom, classes, F, lift } from '@grammarly/focal'
import cc from 'classcat'
import * as React from 'react'
import { gridSettings$ } from '../grid/state'
import { itemsReversed$, selectedID$ } from '../items/state'
import { actionsItems } from '../_generic/actions'
import { defaultItem } from '../_generic/types/common'
import { ReactiveList } from '../_generic/ui/ReactiveList'
import { cssPure$, cssHighlighter$ } from './state'
import $ from './style.scss'

const CSS = lift(({ css, cssHighlighter }: { css: string; cssHighlighter: string }) => (
	<style type="text/css" dangerouslySetInnerHTML={{ __html: css + cssHighlighter }} />
))

const isGrowClass$ = gridSettings$.view(({ isGrow }) => isGrow && $.flexed)

const items$ = itemsReversed$.view((items) => items.filter((item) => !item.isHidden))

export const Preview = () => {
	return (
		<>
			<CSS css={cssPure$} cssHighlighter={cssHighlighter$} />
			<F.div {...classes($.preview, isGrowClass$)}>
				<F.div className={cc(['container', $.container])}>
					<ReactiveList items={items$} defaultItem={defaultItem}>
						{(item$, index) => {
							const id$ = item$.view('id')
							const select = () => actionsItems.select(id$.get())
							const activeClass$ = Atom.combine(
								id$,
								selectedID$,
								(id, sid) => id === sid && $.active
							)
							return (
								<F.div
									key={index}
									{...classes(item$.view('name'), $.item, activeClass$)}
									style={{ backgroundColor: item$.view('color') }}
									onClick={select}
								>
									{item$.view('characters')}
								</F.div>
							)
						}}
					</ReactiveList>
				</F.div>
			</F.div>
		</>
	)
}
