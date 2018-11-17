import * as React from 'react'
import { lift } from '@grammarly/focal'

type TProps = {
	value: any
	eq: any
	children: (instShow: boolean) => React.ReactElement<any>
}

export const ShowIf = lift(
	class extends React.Component<TProps> {
		private didRendered = false
		render() {
			const { value, eq, children } = this.props
			const instShow = !this.didRendered
			if (instShow) {
				this.didRendered = true
			}
			return value === eq && children(instShow)
		}
	}
)
