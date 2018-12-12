import * as React from 'react'
import { icons } from './icons'

type TProps = {
	ico: keyof typeof icons
	fill?: string
}

export class Ico extends React.PureComponent<TProps> {
	render() {
		return (
			<svg width="2em" height="2em" viewBox="0 0 40 40" fill={this.props.fill || 'currentColor'}>
				<g>
					<path d={icons[this.props.ico]} />
				</g>
			</svg>
		)
	}
}
