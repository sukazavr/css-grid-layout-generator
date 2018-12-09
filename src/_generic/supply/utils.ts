import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

export const NTA = (v: string | null) => v || 'auto'

export const debug = (...args: any[]) => <T>(stream: Observable<T>) => {
	if (process.env.NODE_ENV === 'production') {
		return stream
	} else {
		return stream.pipe(
			// tslint:disable-next-line
			tap(console.log.bind(console, ...args))
		)
	}
}

export const isShallowEqual = <T1, T2>(a: T1, b: T2): boolean => {
	if (!a || !b) {
		return !a && !b
	}

	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)
	const aLen = aKeys.length
	const bLen = bKeys.length

	if (aLen === bLen) {
		for (let i = 0; i < aLen; ++i) {
			const key = aKeys[i]
			if (a[key] !== b[key]) {
				return false
			}
		}
		return true
	}

	return false
}
