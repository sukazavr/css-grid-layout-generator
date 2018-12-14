import { combineLatest, merge, Observable } from 'rxjs'
import { shareReplay, startWith, map } from 'rxjs/operators'
import { gridSettings$, explicitGrid$, implicitGrid$ } from '../grid/state'
import { itemsReversed$ } from '../items/state'
import { actionsItems } from '../_generic/actions'
import { ITrack } from '../_generic/types/common'
import { NTA } from '../_generic/supply/utils'

const CONTAINER_NAME = 'container'

const trackSize = ({ value, min, max, minmax, fitContent, repeat }: ITrack) => {
	let size: string
	if (minmax) {
		size = `minmax(${NTA(min)}, ${NTA(max)})`
	} else if (fitContent) {
		size = `fit-content(${NTA(value)})`
	} else {
		size = NTA(value)
	}
	if (repeat) {
		size = `repeat(${repeat}, ${size})`
	}
	return size
}

const tracksHaveSize = (tracks: ITrack[]) => {
	return (
		Boolean(tracks.length) &&
		tracks.some((track) => track.minmax || Boolean(track.repeat) || Boolean(track.value))
	)
}

type TClass = { [rule: string]: string }

const containerCSS$ = combineLatest(gridSettings$, explicitGrid$, implicitGrid$).pipe(
	map(
		([
			{
				isInline,
				isGrow,
				width,
				height,
				colGap,
				rowGap,
				justifyItems,
				alignItems,
				justifyContent,
				alignContent,
				autoFlow,
			},
			{ cols, rows },
			{ cols: autoCols, rows: autoRows },
		]) => {
			const rules: TClass = {
				display: isInline ? 'inline-grid' : 'grid',
			}
			if (!isGrow) {
				if (width) {
					rules.width = width
				}
				if (height) {
					rules.height = height
				}
			}
			if (tracksHaveSize(cols)) {
				rules['grid-template-columns'] = cols.map(trackSize).join(' ')
			}
			if (tracksHaveSize(rows)) {
				rules['grid-template-rows'] = rows.map(trackSize).join(' ')
			}
			if (tracksHaveSize(autoCols)) {
				rules['grid-auto-columns'] = autoCols.map(trackSize).join(' ')
			}
			if (tracksHaveSize(autoRows)) {
				rules['grid-auto-rows'] = autoRows.map(trackSize).join(' ')
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
			if (autoFlow) {
				rules['grid-auto-flow'] = autoFlow
			}
			return rules
		}
	),
	shareReplay(1)
)

const itemsCSS$ = itemsReversed$.pipe(
	map((items) => {
		return items.reduce<{ [name: string]: TClass }>((acc, item) => {
			const {
				name,
				width,
				height,
				colStart,
				rowStart,
				colEnd,
				rowEnd,
				justifySelf,
				alignSelf,
			} = item
			const rules: TClass = {
				'grid-area': `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}`,
			}
			if (width) {
				rules.width = width
			}
			if (height) {
				rules.height = height
			}
			if (justifySelf && alignSelf) {
				rules['place-self'] = alignSelf + ' ' + justifySelf
			} else if (justifySelf) {
				rules['justify-self'] = justifySelf
			} else if (alignSelf) {
				rules['align-self'] = alignSelf
			}
			acc[name] = rules
			return acc
		}, {})
	}),
	shareReplay(1)
)

export const css$ = combineLatest(containerCSS$, itemsCSS$, (containerCSS, itemsCSS) =>
	[
		toCSS(CONTAINER_NAME, containerCSS),
		...Object.entries(itemsCSS).map(([name, itemCSS]) => toCSS(name, itemCSS)),
	].join('\n\n')
)

export const styledComponents$ = combineLatest(containerCSS$, itemsCSS$, (containerCSS, itemsCSS) =>
	[
		"import styled from 'styled-components'",
		toStyledComponent(CONTAINER_NAME, containerCSS),
		...Object.entries(itemsCSS).map(([name, itemCSS]) => toStyledComponent(name, itemCSS)),
	].join('\n\n')
)

export const html$ = itemsReversed$.map((items) => {
	return [
		`<div class="${CONTAINER_NAME}">`,
		...items.map(({ name }) => `\t<div class="${name}"></div>`),
		'</div>',
	].join('\n')
})

export const jsxPlain$ = itemsReversed$.map((items) => {
	return [
		`<div className="${CONTAINER_NAME}">`,
		...items.map(({ name }) => `\t<div className="${name}"></div>`),
		'</div>',
	].join('\n')
})

export const jsxCSSModules$ = itemsReversed$.map((items) => {
	return [
		"import $ from './style.css'",
		'',
		`<div className={$.${CONTAINER_NAME}}>`,
		...items.map(({ name }) => {
			const className = name.includes('-') ? `['${name}']` : `.${name}`
			return `\t<div className={$${className}}></div>`
		}),
		'</div>',
	].join('\n')
})

export const cssHighlighter$: Observable<string> = merge(
	actionsItems.highlight.$.map(
		(name) => `.${name} {
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

const toCSS = (className: string, rules: TClass) => {
	return [
		`.${className} {`,
		...Object.entries(rules).map(([name, rule]) => `\t${name}: ${rule};`),
		'}',
	].join('\n')
}

const toStyledComponent = (className: string, rules: TClass) => {
	return [
		`const ${toPascalCase(className)} = styled.div\``,
		...Object.entries(rules).map(([name, rule]) => `\t${name}: ${rule};`),
		'`',
	].join('\n')
}

const toPascalCase = (className: string) => {
	return className
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('')
}
