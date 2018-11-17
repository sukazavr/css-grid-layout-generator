export const COLORS = [
	'#f44336',
	'#e91e63',
	'#9c27b0',
	'#673ab7',
	'#3f51b5',
	'#436eb1',
	'#03a9f4',
	'#00d4cc',
	'#009688',
	'#4caf50',
	'#8bc34a',
	'#cddc39',
	'#ffeb3b',
	'#ffc107',
	'#ff9800',
	'#ff5722',
	'#795548',
	'#607d8b',
]

let lastIndex = 0

export const getColor = () => COLORS[lastIndex++ % COLORS.length]
