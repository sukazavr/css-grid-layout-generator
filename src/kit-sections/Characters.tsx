import { Slider } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../_generic/ui/MapElement'

const ref = 'ab.cde fghi!jkl mno.pqrs tuvw?xyz'
const makeTextLine = (characters: number) => {
	let res = ''
	const length = ref.length
	while (characters--) {
		res += ref.charAt(Math.floor(Math.random() * length))
	}
	return res.trim()
}

export const Characters = ({ v$ }: { v$: Atom<string> }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				const amount$ = Atom.create(v.length)
				return (
					<div style={{ padding: '0 0.7em 0 0.1em' }}>
						<MapElement stream={amount$}>
							{(amount) => {
								return (
									<Slider
										labelStepSize={1000}
										onChange={(nextA) => amount$.set(nextA)}
										onRelease={(nextV) => v$.set(makeTextLine(nextV))}
										value={amount}
										min={0}
										max={2000}
										stepSize={10}
									/>
								)
							}}
						</MapElement>
					</div>
				)
			}}
		</MapElement>
	)
}
