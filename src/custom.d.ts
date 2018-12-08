declare module 'clipboard-copy' {
	const clipboardCopy: (toClipboard: any) => void
	export default clipboardCopy
}

declare module '*.css' {
	const classes: { [key: string]: string }
	export default classes
}

declare module '*.scss' {
	const classes: { [key: string]: string }
	export default classes
}

declare interface NodeModule {
	hot: any
}
