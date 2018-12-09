import { ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../_generic/ui/MapElement'

const AUTO = 'auto'
const SPAN = 'span'
const LINE = 'line'
const MB_OPTIONS = [LINE, SPAN, AUTO]

export const Location = ({ v$ }: { v$: Atom<string | number> }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				let isSpan: boolean
				let num: number
				let option: string
				if (v === AUTO) {
					isSpan = false
					num = 0
					option = AUTO
				} else if (typeof v === 'string') {
					isSpan = true
					num = Number(v.replace(SPAN, ''))
					option = SPAN
				} else {
					isSpan = false
					num = v
					option = LINE
				}
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
										: isSpan
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
										: nextNum
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
