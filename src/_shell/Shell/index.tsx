import { classes, F } from '@grammarly/focal'
import * as React from 'react'
import {
	blindByAreaSelector$,
	isActiveAreaSelector$,
	titleOfAreaSelector$,
} from '../../area-selector/state'
import { GetTheCode } from '../../get-the-code'
import { Grid } from '../../grid'
import { Items } from '../../items'
import { Preview } from '../../preview'
import { actionsAreaSelector } from '../../_generic/actions'
import { ShowIf } from '../../_generic/ui/ShowIf'
import { WorkSpace } from '../WorkSpace'
const $ = require('./style.scss')

// tslint:disable:max-line-length
export const Shell = () => {
	// return <WorkSpace />
	return (
		<div className={$.shell}>
			<F.div {...classes($.preview, blindByAreaSelector$)}>
				<div className={$.title}>Layout Preview</div>
				<div className={$.content}>
					<Preview />
				</div>
			</F.div>
			<div className={$.grid}>
				<ShowIf value={isActiveAreaSelector$} eq={true}>
					{() => (
						<div style={{ display: 'flex' }}>
							<F.div className={$.title}>{titleOfAreaSelector$}</F.div>
							<div className={$.doneBtn} onClick={actionsAreaSelector.done}>
								Done [ESC]
							</div>
						</div>
					)}
				</ShowIf>
				<ShowIf value={isActiveAreaSelector$} eq={false}>
					{() => <div className={$.title}>Grid Container</div>}
				</ShowIf>
				<div className={$.content}>
					<Grid />
				</div>
			</div>
			<F.div {...classes($.sidebar, blindByAreaSelector$)}>
				<div className={$.head}>
					<svg
						className={$.logo}
						role="img"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>CSS Grid Layout Generator</title>
						<path d="M10,0.531c-5.229,0-9.469,4.239-9.469,9.469S4.771,19.469,10,19.469s9.469-4.239,9.469-9.469S15.229,0.531,10,0.531 M11.128,18.525c-0.371,0.049-0.745,0.082-1.128,0.082c-4.754,0-8.608-3.854-8.608-8.607S5.246,1.392,10,1.392c0.383,0,0.758,0.034,1.128,0.083c1.976,2.269,3.176,5.281,3.176,8.525S13.103,16.257,11.128,18.525" />
					</svg>
					<div className={$.ver}>v{process.env.VERSION || 0}</div>
					<svg
						className={$.gh}
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Open Source Code On GitHub</title>
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
					</svg>
				</div>
				<div className={$.code}>
					<GetTheCode />
				</div>
				<div className={$.items}>
					<Items />
				</div>
				<div className={$.footer}>❤</div>
			</F.div>
		</div>
	)
}
