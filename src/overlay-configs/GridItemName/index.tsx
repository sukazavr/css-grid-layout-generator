import { EditableText, H3 } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../../_generic/ui/MapElement'

const identify = (ugly: string) => {
	const step1 = ugly.replace(/^[^-_a-zA-Z]+/, '').replace(/^-(?:[-0-9]+)/, '-')
	const step2 = step1 && step1.replace(/[^-_a-zA-Z0-9]+/g, '-')
	return step2
}

export const GridItemName = ({ v$ }: { v$: Atom<string> }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				return (
					<H3>
						<EditableText
							defaultValue={v}
							maxLength={64}
							minWidth={300}
							selectAllOnFocus={true}
							onConfirm={(nextName) => {
								nextName = identify(nextName)
								if (nextName) {
									v$.set(nextName)
								}
							}}
						/>
					</H3>
				)
			}}
		</MapElement>
	)
}
