import * as React from 'react'
import $ from './style.scss'

export const tipAlignSelf = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-31">
		Aligns a grid item inside a cell along the <em>block (column)</em> axis (as opposed to{' '}
		<code>justify-self</code> which aligns along the <em>inline (row)</em> axis). This value
		applies to the content inside a single grid item.
	</Tip>
)

export const tipJustifySelf = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-30">
		Aligns a grid item inside a cell along the <em>inline (row)</em> axis (as opposed to{' '}
		<code>align-self</code> which aligns along the <em>block (column)</em> axis). This value
		applies to a grid item inside a single cell.
	</Tip>
)

export const tipGap = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-16">
		Specifies the size of the grid lines. You can think of it like setting the width of the
		gutters between the columns/rows.
	</Tip>
)

export const tipAutoFlow = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-25">
		If you have grid items that you don't explicitly place on the grid, the{' '}
		<em>auto-placement algorithm</em> kicks in to automatically place the items. This property
		controls how the auto-placement algorithm works.
		<br />
		<code>dense</code> - tells the auto-placement algorithm to attempt to fill in holes earlier in
		the grid if smaller items come up later.
	</Tip>
)

export const tipAlignContent = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-22">
		Sometimes the total size of your grid might be less than the size of its grid container. This
		could happen if all of your grid items are sized with non-flexible units like <code>px</code>.
		In this case you can set the alignment of the grid within the grid container. This property
		aligns the grid along the <em>block (column)</em> axis (as opposed to{' '}
		<code>justify-content</code> which aligns the grid along the <em>inline (row)</em> axis).
	</Tip>
)

export const tipJustifyContent = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-21">
		Sometimes the total size of your grid might be less than the size of its grid container. This
		could happen if all of your grid items are sized with non-flexible units like <code>px</code>.
		In this case you can set the alignment of the grid within the grid container. This property
		aligns the grid along the <em>inline (row)</em> axis (as opposed to <code>align-content</code>{' '}
		which aligns the grid along the <em>block (column)</em> axis).
	</Tip>
)

export const tipAlignItems = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-19">
		Aligns grid items along the <em>block (column)</em> axis (as opposed to{' '}
		<code>justify-items</code> which aligns along the <em>inline (row)</em> axis). This value
		applies to all grid items inside the container.
	</Tip>
)

export const tipJustifyItems = () => (
	<Tip url="https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-18">
		Aligns grid items along the <em>inline (row)</em> axis (as opposed to <code>align-items</code>{' '}
		which aligns along the <em>block (column)</em> axis). This value applies to all grid items
		inside the container.
	</Tip>
)

export const tipInlineGrid = () => (
	<Tip url="https://stackoverflow.com/a/24313727/10744049">
		Generates an inline-level grid. The inside of an inline-grid is formatted as a block-level
		grid container, and the element itself is formatted as an atomic inline-level box.
	</Tip>
)

export const tipContainerFlexGrow = () => (
	<Tip>
		If <em>enabled</em>, the container tends to fill the entire space of the preview
		window. If <em>disabled</em>, the size of the container can be customized manually.
	</Tip>
)

export const tipRepeat = () => (
	<Tip url="https://developer.mozilla.org/en-US/docs/Web/CSS/repeat">
		The <code>repeat()</code> CSS function represents a repeated fragment of the track list,
		allowing a large number of columns or rows that exhibit a recurring pattern to be written in a
		more compact form.
	</Tip>
)

export const tipFitContent = () => (
	<Tip url="https://developer.mozilla.org/en-US/docs/Web/CSS/fit-content">
		⚠ This is an experimental technology
		<hr />
		Represents the formula <code>min(max-content, max(auto, argument))</code>, which is calculated
		similar to <code>auto</code> (i.e. <code>minmax(auto, max-content)</code>), except that the
		track size is clamped at <em>argument</em> if it is greater than the <code>auto</code>{' '}
		minimum.
	</Tip>
)

export const tipMinmax = () => (
	<Tip url="https://developer.mozilla.org/en-US/docs/Web/CSS/minmax">
		The <code>minmax()</code> CSS function defines a size range greater than or equal to{' '}
		<em>min</em> and less than or equal to <em>max</em>.
	</Tip>
)

type TProps = {
	url?: string
	children: React.ReactNode
}

const Tip = ({ children, url }: TProps) => {
	return (
		<div className={$.container}>
			<div className={$.tip}>{children}</div>
			{Boolean(url) && (
				<div className={$.url}>
					<label>Read more</label>
					<a href={url} target="_blank">
						{url}
					</a>
				</div>
			)}
		</div>
	)
}
