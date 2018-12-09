import { ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../_generic/ui/MapElement'

const DISABLED = 'disabled'
const INTEGER = 'integer'
const AUTO_FILL = 'auto-fill'
const AUTO_FIT = 'auto-fit'

const MB_OPTIONS = [DISABLED, INTEGER, AUTO_FILL, AUTO_FIT]

export const Repeat = ({ v$ }: { v$: Atom<string | number> }) => {
	return (
		<MapElement stream={v$}>
			{(repeat) => {
				const isNumber = typeof repeat === 'number'
				const option = isNumber ? (repeat ? INTEGER : DISABLED) : repeat
				return (
					<ControlGroup>
						<NumericInput
							buttonPosition="left"
							min={0}
							majorStepSize={1}
							minorStepSize={1}
							value={isNumber ? repeat : 0}
							onValueChange={(v) => v$.set(v)}
							selectAllOnFocus={true}
							clampValueOnBlur={true}
							onBlur={() => v$.modify((v) => (v > 1 ? v : 0))}
							style={{ width: '2em' }}
						/>
						<HTMLSelect
							options={MB_OPTIONS}
							onChange={(e) => {
								const nextOption = e.target.value
								v$.set(
									nextOption === DISABLED ? 0 : nextOption === INTEGER ? 2 : nextOption
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
