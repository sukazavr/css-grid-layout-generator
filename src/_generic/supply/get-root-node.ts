export const getRootNode = () => {
	const rootNode = document.getElementById('root')
	if (rootNode) {
		return rootNode
	} else {
		throw new Error('Root element not found. Wrong HTML file?')
	}
}
