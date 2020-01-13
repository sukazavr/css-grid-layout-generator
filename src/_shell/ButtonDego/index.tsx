import * as React from 'react'

import $ from './style.scss'

// tslint:disable:max-line-length
export const ButtonDego: React.FC = () => {
	return (
		<a
			className={$.btn}
			href="https://dego.app/"
			title="New tool. CSS Grid support will be added soon 🙌"
		>
			<span>
				<b>Flexbox</b>
				<br />
				Generator
				<br />
				with UX like
				<br />
				Figma/Sketch
			</span>
			<svg width="32px" height="32px" viewBox="0 0 100 100" fill="currentColor">
				<path d="M28.78 29.83L50 26l21.22 3.83C82 22.5 84 14.5 76.5 4.5l18 3.5c9 12-8.5 24.5-15.94 27.9L98 55l-8 4.04-6 7.46-6.6 2.5-6.09 11.85L50 95.5 28.69 80.85 22.59 69 16 66.5l-6-7.46L2 55l19.44-19.1C14 32.5-3.5 20 5.5 8l18-3.5c-7.5 10-5.5 18 5.28 25.33z" />
			</svg>
		</a>
	)
}
