import * as React from 'react'
import { Observable } from 'rxjs'
import { LiftWrapper } from '@grammarly/focal/dist/src/react'

export class MapElement<T> extends React.PureComponent<{
	stream: Observable<T>
	children: (stream: T) => React.ReactNode
}> {
	render() {
		return React.createElement(LiftWrapper, {
			component: ({ stream }: any) => this.props.children(stream) as any,
			props: { stream: this.props.stream },
		})
	}
}
