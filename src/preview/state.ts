import { combineLatest, merge, Observable } from 'rxjs'
import { shareReplay, startWith, map } from 'rxjs/operators'
import { gridSettings$, explicitGrid$, implicitGrid$ } from '../grid/state'
import { itemsReversed$ } from '../items/state'
import { actionsItems } from '../_generic/actions'
import { ITrack } from '../_generic/types/common'
import { NTA } from '../_generic/supply/utils'
import $ from '../get-the-code/style.scss'

const span = (className: string) => (value: string) => `<span class="${className}">${value}</span>`
const line = span($.line)
const hl1 = span($.hl1)
const hl2 = span($.hl2)
const hl3 = span($.hl3)

const DIV = hl1('div')
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

export const cssHighlighter$: Observable<string> = merge(
	actionsItems.dropHighlight.$.map(() => ''),
	actionsItems.highlight.$.map(
		(name) => `.${name} {
	z-index: 99;
	box-shadow:
		inset 0px 0px 0px 2px #fff,
		inset 0px 0px 1em 2px #000;
	}`
	)
).pipe(
	startWith(''),
	shareReplay(1)
)

export const cssPure$ = combineLatest(containerCSS$, itemsCSS$, (containerCSS, itemsCSS) =>
	[
		toPureCSS(CONTAINER_NAME, containerCSS),
		...Object.entries(itemsCSS).map(([name, itemCSS]) => toPureCSS(name, itemCSS)),
	].join('\n\n')
)

const toPureCSS = (className: string, rules: TClass) => {
	return [
		`.${className} {`,
		...Object.entries(rules).map(([name, rule]) => `\t${name}: ${rule};`),
		'}',
	].join('\n')
}

export const css$ = combineLatest(containerCSS$, itemsCSS$, (containerCSS, itemsCSS) =>
	[
		...toCSS(CONTAINER_NAME, containerCSS),
		...Object.entries(itemsCSS).reduce<string[]>(
			(res, [name, itemCSS]) => res.concat('', toCSS(name, itemCSS)),
			[]
		),
	]
		.map(line)
		.join('\n')
)

export const styledComponents$ = combineLatest(containerCSS$, itemsCSS$, (containerCSS, itemsCSS) =>
	[
		`${hl2('import')} styled ${hl2('from')} ${hl3("'styled-components'")}`,
		'',
		...toStyledComponent(CONTAINER_NAME, containerCSS),
		...Object.entries(itemsCSS).reduce<string[]>(
			(res, [name, itemCSS]) => res.concat('', toStyledComponent(name, itemCSS)),
			[]
		),
	]
		.map(line)
		.join('\n')
)

export const html$ = itemsReversed$.map((items) => {
	return [
		`&lt;${DIV} class=${hl3(`&quot;${CONTAINER_NAME}&quot;`)}&gt;`,
		...items.map(
			({ name }) => `\t&lt;${DIV} class=${hl3(`&quot;${name}&quot;`)}&gt;&lt;/${DIV}&gt;`
		),
		`&lt;/${DIV}&gt;`,
	]
		.map(line)
		.join('\n')
})

export const jsxPlain$ = itemsReversed$.map((items) => {
	return [
		`&lt;${DIV} className=${hl3(`&quot;${CONTAINER_NAME}&quot;`)}&gt;`,
		...items.map(
			({ name }) => `\t&lt;${DIV} className=${hl3(`&quot;${name}&quot;`)}&gt;&lt;/${DIV}&gt;`
		),
		`&lt;/${DIV}&gt;`,
	]
		.map(line)
		.join('\n')
})

export const jsxCSSModules$ = itemsReversed$.map((items) => {
	return [
		`${hl2('import')} $ ${hl2('from')} ${hl3("'./style.css'")}`,
		'',
		`&lt;${DIV} className={$.${hl3(CONTAINER_NAME)}}&gt;`,
		...items.map(({ name }) => {
			const className = name.includes('-') ? `[${hl3(`'${name}'`)}]` : `.${hl3(name)}`
			return `\t&lt;${DIV} className={$${className}}&gt;&lt;/${DIV}&gt;`
		}),
		`&lt;/${DIV}&gt;`,
	]
		.map(line)
		.join('\n')
})

const toCSS = (className: string, rules: TClass) => {
	return [
		`.${hl1(className)} ${hl2('{')}`,
		...Object.entries(rules).map(([name, rule]) => `\t${name}: ${hl3(rule)};`),
		hl2('}'),
	]
}

const toStyledComponent = (className: string, rules: TClass) => {
	return [
		`${hl2('const')} ${hl1(toPascalCase(className))} = styled.div${hl3('`')}`,
		...Object.entries(rules).map(([name, rule]) => `\t${name}: ${hl3(rule)};`),
		hl3('`'),
	]
}

const toPascalCase = (className: string) => {
	return className
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('')
}
