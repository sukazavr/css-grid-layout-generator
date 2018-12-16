import * as React from 'react'
import { hot, setConfig } from 'react-hot-loader'
import { Logo } from '../_generic/ui/Logo'
import { Video } from '../_generic/ui/Video'
import $ from './style.scss'

setConfig({
	logLevel: 'debug',
	ignoreSFC: true, // RHL will be __completely__ disabled for SFC
	pureRender: true, // RHL will not change render method
})

const textJSDisabled = [
	'JavaScript is disabled.',
	'The app requires JS.',
	'Please, enable JavaScript and refresh the page.',
].join(' ')

const textNoSupport = [
	"Unfortunately, your browser doesn't support CSS Grid Layout.",
	'Please, upgrade your browser.',
	'Google Chrome is a good option.',
	'Hope to see you again :-)',
].join(' ')

export const Landing = hot(module)(() => {
	return (
		<>
			<div className={$.guard}>
				<div className={$.container}>
					<div className={$.header}>
						<Title />
						<Subtitle />
					</div>
					<Message text={textJSDisabled} id="JSDisabled" />
					<Message text={textNoSupport} id="NoSupport" hidden />
					<AppLoading />
					<AppButton />
					<div className={hide($.video)} id="Video">
						<Video />
					</div>
					<Message id="LittleSpace" hidden />
				</div>
			</div>
			<div className={hide($.app)} id="App" />
		</>
	)
})

const Title = () => (
	<div className={$.title}>
		<Logo size="1.33em" />
		<h1>
			CSS
			<br />
			Grid
			<br />
			Layout
			<br />
			Generator
		</h1>
	</div>
)

const Subtitle = () => (
	<div className={$.subtitle}>
		<h2>Build complex CSS grid layouts — visually</h2>
		<p>
			It's a professional tool: implicit grid tracks (auto-generated grid), minmax(),
			fit-content(), export in JSX and Styled Components.
		</p>
	</div>
)

const AppLoading = () => (
	<div className={hide($.wrapper)} id="AppLoading">
		<div className={$.appLoading}>App is loading...</div>
	</div>
)

const AppButton = () => (
	<div className={hide($.wrapper)} id="AppButton">
		<button className={$.appButton}>RUN!</button>
	</div>
)

const Message = ({ text, id, hidden }: { text?: string; id?: string; hidden?: boolean }) => (
	<div className={hidden ? hide($.message) : $.message} id={id}>
		<p>{text}</p>
	</div>
)

const hide = (className: string) => className + ' hidden'
