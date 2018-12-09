import { HTMLSelect } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../_generic/ui/MapElement'

const NONE = 'default'

export const Select = ({ v$, options }: { v$: Atom<string | null>; options: string[] }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				const allOptions = [NONE, ...options]
				const value = v === null || !options.includes(v) ? NONE : v
				return (
					<HTMLSelect
						fill
						options={allOptions}
						onChange={(e) => {
							const nextValue = e.target.value
							v$.set(nextValue === NONE ? null : nextValue)
						}}
						value={value}
					/>
				)
			}}
		</MapElement>
	)
}
