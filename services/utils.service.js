const APP_URL = process.env.APP_URL

export function isServer() {
	return typeof window === 'undefined'
}

export function convertFullUrl(url) {
	return `${APP_URL}`+ url;
}

export function moveToElementId(element) {
	const elm = document.getElementById(element)
	window.scrollTo({
		top: _getElementOffset(elm).top,
		behavior: 'smooth'
	})
}
