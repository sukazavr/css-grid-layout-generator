import { ControlGroup, HTMLSelect, NumericInput } from '@blueprintjs/core'
import { Atom } from '@grammarly/focal'
import * as React from 'react'
import { MapElement } from '../_generic/ui/MapElement'

const FR = 'fr'

const PX = 'px'
const EM = 'em'
const REM = 'rem'
const LENGTH = [PX, EM, REM]

const VW = 'vw'
const VH = 'vh'
const PERCENT = '%'
const RANGED = [VW, VH, PERCENT]

const MIN_C = 'min-content'
const MAX_C = 'max-content'
const SPECIAL = [MIN_C, MAX_C]

const AUTO = 'auto'
const DEFAULT = 'default'

const MB_OPTIONS = [...LENGTH, ...RANGED]

export const Size = ({
	v$,
	special = false,
	flex = false,
}: {
	v$: Atom<string | null>
	special?: boolean
	flex?: boolean
}) => {
	const D_OPTION = flex ? AUTO : DEFAULT
	const OPTIONS = [D_OPTION, ...MB_OPTIONS]
	if (special) {
		OPTIONS.push(...SPECIAL)
	}
	if (flex) {
		OPTIONS.splice(1, 0, FR)
	}
	return (
		<MapElement stream={v$}>
			{(v) => {
				const isD = v === null
				const NAN = isD || (special && SPECIAL.includes(v as string))
				const num = NAN ? 0 : parseFloat(v as string)
				const option = NAN ? v || D_OPTION : (v as string).replace(String(num), '')
				return (
					<ControlGroup>
						<NumericInput
							buttonPosition="left"
							majorStepSize={10}
							minorStepSize={0.1}
							value={num}
							onValueChange={(nextNum) => v$.set(nextNum + (NAN ? EM : option))}
							selectAllOnFocus={true}
							clampValueOnBlur={true}
							style={{ width: '2em' }}
						/>
						<HTMLSelect
							options={OPTIONS}
							onChange={(e) => {
								const nextOption = e.target.value
								v$.set(
									nextOption === D_OPTION
										? null
										: special && SPECIAL.includes(nextOption)
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
