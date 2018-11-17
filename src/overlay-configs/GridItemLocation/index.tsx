import { ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../../_generic/ui/MapElement'

export const AUTO = 'auto'
export const SPAN = 'span'
const LINE = 'line'
const MB_OPTIONS = [LINE, SPAN, AUTO]

export const GridItemLocation = ({ v$ }: { v$: Atom<string> }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				const isAuto = v === AUTO
				const isSpan = !isAuto && v.includes(SPAN)
				const num = isAuto ? 0 : isSpan ? Number(v.replace(SPAN, '')) : Number(v)
				const option = isAuto ? AUTO : isSpan ? SPAN : LINE
				return (
					<ControlGroup>
						<NumericInput
							buttonPosition="left"
							majorStepSize={1}
							minorStepSize={1}
							value={num}
							onValueChange={(nextNum) =>
								v$.set(
									!nextNum || nextNum < 1
										? AUTO
										: !num || isSpan
											? `${SPAN} ${nextNum}`
											: nextNum.toString()
								)
							}
							min={0}
							selectAllOnFocus={true}
							clampValueOnBlur={true}
							style={{ width: '2em' }}
						/>
						<HTMLSelect
							options={MB_OPTIONS}
							onChange={(e) => {
								const nextOption = e.target.value
								const nextNum = num || 1
								v$.set(
									nextOption === AUTO
										? AUTO
										: nextOption === SPAN
											? `${SPAN} ${nextNum}`
											: nextNum.toString()
								)
							}}
							value={option}
						/>
					</ControlGroup>
				)
			}}
		</MapElement>
	)
}
