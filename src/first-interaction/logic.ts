if (process.env.NODE_ENV === 'production') {
	window.dataLayer = window.dataLayer || []
	window.gtag = function() {
		window.dataLayer.push(arguments)
	}
	window.gtag('js', new Date())
	window.gtag('config', 'UA-129342832-1')
}

let isAppMounted = false
const MIN_WIDTH = 1099
const HIDDEN = 'hidden'
const SKIP_INTRO = '__SKIP_INTRO__'
const hide = (el: HTMLElement) => {
	if (!isHidden(el)) {
		el.classList.add(HIDDEN)
	}
}
const show = (el: HTMLElement) => {
	if (isHidden(el)) {
		el.classList.remove(HIDDEN)
	}
}
const isHidden = (el: HTMLElement) => el.classList.contains(HIDDEN)
const getElement = (id: string) => document.getElementById(id) as HTMLElement

const App = getElement('App')
const Video = getElement('Video')
const NoSupport = getElement('NoSupport')
const AppButton = getElement('AppButton')
const JSDisabled = getElement('JSDisabled')
const AppLoading = getElement('AppLoading')
const LittleSpace = getElement('LittleSpace')

const init = () => {
	hide(JSDisabled)
	show(Video)
	if (CSS && CSS.supports && CSS.supports('display: grid')) {
		screenSize()
		window.addEventListener('resize-end', screenSize)
	} else {
		show(NoSupport)
	}
}

const screenSize = () => {
	if (window.innerWidth > MIN_WIDTH) {
		hide(LittleSpace)
		if (isAppMounted) {
			canRunTheApp()
		} else {
			show(AppLoading)
			import(/* webpackChunkName: "app" */
			'../_shell').then(({ mount }) => {
				mount(App)
				hide(AppLoading)
				canRunTheApp()
				isAppMounted = true
			})
		}
	} else {
		hide(App)
		hide(AppButton)
		showLittleSpace(window.innerHeight)
	}
}

const canRunTheApp = () => {
	if (localStorage.getItem(SKIP_INTRO)) {
		show(App)
	} else {
		showAppButton()
	}
}

const showLittleSpace = (innerHeight: number) => {
	const p = LittleSpace.children.item(0) as HTMLParagraphElement
	const text = [
		'The app requires at least 1100px of screen width.',
		innerHeight > MIN_WIDTH
			? 'Please, try to switch your device to landscape mode.'
			: 'Please, open this page on your laptop or desktop with big screen.',
	]
	p.innerHTML = text.join(' ')
	show(LittleSpace)
}

const showAppButton = () => {
	const button = AppButton.children.item(0) as HTMLButtonElement
	button.onclick = () => {
		localStorage.setItem(SKIP_INTRO, 'y')
		show(App)
	}
	show(AppButton)
}

init()

document.addEventListener('DOMContentLoaded', () => {
	let resizeEnd: NodeJS.Timeout
	window.addEventListener('resize', () => {
		clearTimeout(resizeEnd)
		resizeEnd = setTimeout(() => {
			window.dispatchEvent(new Event('resize-end'))
		}, 100)
	})
})
