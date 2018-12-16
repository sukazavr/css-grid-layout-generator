import { merge } from 'rxjs'
import { actionsGrid, actionsItems, actionsShell } from '../_generic/actions'

type TAnalyticsEvent = {
	action: string
}

merge(
	actionsShell.howToUse.$.map(() => ({ action: 'how_to_use' })),
	actionsShell.getCode.$.map(() => ({ action: 'get_the_code' })),
	actionsItems.add.$.map(() => ({ action: 'add_item' })),
	merge(actionsGrid.addCol.$, actionsGrid.addAfterCol.$, actionsGrid.addBeforeCol.$).map(() => ({
		action: 'add_column',
	})),
	merge(actionsGrid.addRow.$, actionsGrid.addAfterRow.$, actionsGrid.addBeforeRow.$).map(() => ({
		action: 'add_row',
	}))
).subscribe((e: TAnalyticsEvent) => {
	if (process.env.NODE_ENV === 'production') {
		window.gtag('event', e.action)
	} else {
		// tslint:disable:no-console
		console.info('AnalyticsEvent:', e.action)
	}
})
