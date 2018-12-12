import { Atom, Lens, ReadOnlyAtom } from '@grammarly/focal'
import { LiftWrapper, reactiveList } from '@grammarly/focal/dist/src/react'
import * as React from 'react'

export class ReactiveList<
	T1,
	T2 extends { [key: string]: T1 } | T1[],
	T3 extends Atom<T2> | ReadOnlyAtom<T2>
> extends React.PureComponent<{
	items: T3
	defaultItem: T1
	children: (
		item$: T3 extends Atom<T2> ? Atom<T1> : ReadOnlyAtom<T1>,
		key: T2 extends T1[] ? number : string
	) => React.ReactNode
}> {
	render() {
		const { items, defaultItem, children } = this.props
		return React.createElement(LiftWrapper, {
			component: ({ result }: any) => result,
			props: {
				result: reactiveList(
					items.map((x) =>
						Array.isArray(x) ? x.map((_, index) => index) : (Object.keys(x) as any)
					),
					(key) => {
						let item$: any
						const lensDefault = Lens.withDefault(defaultItem)
						const lensItem =
							typeof key === 'string' ? Lens.key(key) : (Lens.index(key) as any)
						if ((items as any).set) {
							item$ = (items as Atom<any>).lens(lensItem).lens(lensDefault)
						} else {
							item$ = items.view(lensItem).view(lensDefault)
						}
						return children(item$, key as any)
					}
				),
			},
		})
	}
}
