import * as React from 'react'
import $ from './style.scss'

export const Video = ({ autoplay = false }: { autoplay?: boolean }) => {
	const auto = (autoplay ? 1 : 0).toString()
	return (
		<div className={$.video}>
			<iframe
				width="2046"
				height="952"
				src={`https://www.youtube.com/embed/9J5VqpKPSNk?modestbranding=1&autoplay=${auto}&rel=0`}
				frameBorder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	)
}
