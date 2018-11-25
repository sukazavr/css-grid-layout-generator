import { HTMLSelect } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../../_generic/ui/MapElement'

const NONE = 'default'
const MB_OPTIONS = [NONE, 'row', 'row dense', 'column', 'column dense']

export const GridAutoFlow = ({ v$ }: { v$: Atom<string | null> }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				const option = v === null ? NONE : v
				return (
					<HTMLSelect
						options={MB_OPTIONS}
						onChange={(e) => {
							const next = e.target.value
							v$.set(next === NONE ? null : next)
						}}
						value={option}
					/>
				)
			}}
		</MapElement>
	)
}
