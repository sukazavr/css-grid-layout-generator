import { Atom, Lens } from '@grammarly/focal'
import { LiftWrapper, reactiveList } from '@grammarly/focal/dist/src/react'
import * as React from 'react'

export class ReactiveList<T, D extends { [key: string]: T } | T[]> extends React.PureComponent<{
	items: Atom<D>
	defaultItem: T
	children: (item$: Atom<T>, key: D extends T[] ? number : string) => React.ReactNode
}> {
	render() {
		const { items, defaultItem, children } = this.props
		return React.createElement(LiftWrapper, {
			component: ({ result }: any) => result,
			props: {
				result: reactiveList(
					items.map(
						(x) => (Array.isArray(x) ? x.map((_, index) => index) : (Object.keys(x) as any))
					),
					(key) => {
						const item$ = items
							.lens((typeof key === 'string' ? Lens.key(key) : Lens.index(key)) as any)
							.lens(Lens.withDefault(defaultItem))
						return children(item$, key as any)
					}
				),
			},
		})
	}
}
