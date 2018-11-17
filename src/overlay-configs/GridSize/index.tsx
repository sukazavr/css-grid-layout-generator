import { ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../../_generic/ui/MapElement'

const PX = 'px'
const EM = 'em'
const REM = 'rem'
const VW = 'vw'
const VH = 'vh'
const PERCENT = '%'

const MIN_C = 'min-content'
const MAX_C = 'max-content'
const DEFAULT = 'default'

const RANGED = [VW, VH, PERCENT]
const SPECIAL = [MIN_C, MAX_C]
const MB_OPTIONS = [DEFAULT, PX, EM, REM, ...RANGED]

export const GridSize = ({ v$, withSpecial }: { v$: Atom<string | null>; withSpecial?: true }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				const WS = Boolean(withSpecial)
				const options = WS ? MB_OPTIONS.concat(SPECIAL) : MB_OPTIONS
				const isDefault = v === null
				const isSpecial = isDefault || (WS && SPECIAL.includes(v as string))
				const num = isSpecial ? 0 : parseFloat(v as string)
				const option = isSpecial ? v || DEFAULT : (v as string).replace(String(num), '')
				return (
					<ControlGroup>
						<NumericInput
							buttonPosition="left"
							majorStepSize={10}
							minorStepSize={0.1}
							value={num}
							onValueChange={(nextNum) => v$.set(nextNum + (isSpecial ? PX : option))}
							selectAllOnFocus={true}
							clampValueOnBlur={true}
							style={{ width: '2em' }}
						/>
						<HTMLSelect
							options={options}
							onChange={(e) => {
								const nextOption = e.target.value
								v$.set(
									nextOption === DEFAULT
										? null
										: WS && SPECIAL.includes(nextOption)
											? nextOption
											: num + nextOption
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
