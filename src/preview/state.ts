import { combineLatest, merge, Observable } from 'rxjs'
import { shareReplay, startWith } from 'rxjs/operators'
import { cols$, grid$, rows$ } from '../grid/state'
import { itemsReversed$ } from '../items/state'
import { actionsItems } from '../_generic/actions'

type TClass = { [rule: string]: string }

const containerCSS$ = combineLatest(grid$, cols$, rows$).map(
	([
		{
			isInline,
			width,
			height,
			colGap,
			rowGap,
			justifyItems,
			alignItems,
			justifyContent,
			alignContent,
		},
		cols,
		rows,
	]) => {
		const rules: TClass = {
			display: isInline ? 'inline-grid' : 'grid',
		}
		if (width) {
			rules.width = width
		}
		if (height) {
			rules.height = height
		}
		const columns = Object.values(cols)
		if (columns.length) {
			rules['grid-template-columns'] = columns.map((v) => v.size).join(' ')
		}
		const roo = Object.values(rows)
		if (roo.length) {
			rules['grid-template-rows'] = roo.map((v) => v.size).join(' ')
		}
		if (colGap && rowGap) {
			rules['grid-gap'] = rowGap + ' ' + colGap
		} else if (colGap) {
			rules['grid-column-gap'] = colGap
		} else if (rowGap) {
			rules['grid-row-gap'] = rowGap
		}
		if (justifyItems && alignItems) {
			rules['place-items'] = alignItems + ' ' + justifyItems
		} else if (justifyItems) {
			rules['justify-items'] = justifyItems
		} else if (alignItems) {
			rules['align-items'] = alignItems
		}
		if (justifyContent && alignContent) {
			rules['place-content'] = alignContent + ' ' + justifyContent
		} else if (justifyContent) {
			rules['justify-content'] = justifyContent
		} else if (alignContent) {
			rules['align-content'] = alignContent
		}
		return toCSS('container', rules)
	}
)

const itemsCSS$ = itemsReversed$.map((items) => {
	return items.map((item) => {
		const { name, colStart, rowStart, colEnd, rowEnd, justifySelf, alignSelf } = item
		const rules: TClass = {
			'grid-area': `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`,
		}
		if (justifySelf && alignSelf) {
			rules['place-self'] = alignSelf + ' ' + justifySelf
		} else if (justifySelf) {
			rules['justify-self'] = justifySelf
		} else if (alignSelf) {
			rules['align-self'] = alignSelf
		}
		return toCSS(name, rules)
	})
})

export const css$ = combineLatest(containerCSS$, itemsCSS$, (containerCSS, itemsCSS) =>
	[containerCSS, ...itemsCSS].join('\n\n')
)

export const html$ = itemsReversed$.map((items) => {
	return `<div class="container">\n${items
		.map(({ name }) => `\t<div class="${name}"></div>\n`)
		.join('')}</div>`
})

export const cssHighlighter$: Observable<string> = merge(
	actionsItems.highlight.$.map(
		({ name }) => `.${name} {
	z-index: 99;
	box-shadow:
		inset 0px 0px 0px 2px #fff,
		inset 0px 0px 1em 2px #000;
	}`
	),
	actionsItems.dropHighlight.$.map(() => '')
).pipe(
	startWith(''),
	shareReplay(1)
)

const toCSS = (className: string, rules: TClass) =>
	`.${className} {\n${Object.entries(rules)
		.map(([ruleName, rule]) => `\t${ruleName}: ${rule};\n`)
		.join('')}}`
