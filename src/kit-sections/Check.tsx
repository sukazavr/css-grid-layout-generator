import * as React from 'react'
import { MapElement } from '../_generic/ui/MapElement'
import { Atom } from '@grammarly/focal'
import { Switch } from '@blueprintjs/core'

export const Check = ({ v$, label }: { v$: Atom<boolean>; label?: string }) => {
	return (
		<MapElement stream={v$}>
			{(v) => (
				<Switch
					checked={v}
					label={label}
					onChange={(e) => v$.set((e.target as HTMLInputElement).checked)}
				/>
			)}
		</MapElement>
	)
}
