declare const PRERENDER: boolean

declare module 'from-html' {
	const fromHTML: (template: string) => { [elName: string]: HTMLElement }
	export default fromHTML
}

declare module 'clipboard-copy' {
	const clipboardCopy: (toClipboard: any) => void
	export default clipboardCopy
}

declare module '*.css' {
	const content: string
	export default content
}

declare module '*.scss' {
	const classes: { [key: string]: string }
	export default classes
}

// tslint:disable-next-line:interface-name
declare interface NodeModule {
	hot: any
}

// tslint:disable-next-line:interface-name
declare interface Window {
	dataLayer: any[]
	gtag: (...args: any[]) => void
}
