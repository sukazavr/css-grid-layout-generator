import { ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../../_generic/ui/MapElement'

const FR = 'fr'
const PX = 'px'
const EM = 'em'
const REM = 'rem'
const VW = 'vw'
const VH = 'vh'
const PERCENT = '%'

const AUTO = 'auto'
const MIN_C = 'min-content'
const MAX_C = 'max-content'

const RANGED = [VW, VH, PERCENT]
const SPECIAL = [MIN_C, MAX_C, AUTO]
const MB_OPTIONS = [FR, PX, EM, REM, ...RANGED, ...SPECIAL]

export const GridUnitSize = ({ v$ }: { v$: Atom<string> }) => {
	return (
		<MapElement stream={v$}>
			{(v) => {
				const isSpecial = SPECIAL.includes(v)
				const num = isSpecial ? 0 : parseFloat(v)
				const option = isSpecial ? v : v.replace(String(num), '')
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
							options={MB_OPTIONS}
							onChange={(e) => {
								const nextOption = e.target.value
								v$.set(SPECIAL.includes(nextOption) ? nextOption : num + nextOption)
							}}
							value={option}
						/>
					</ControlGroup>
				)
			}}
		</MapElement>
	)
}
