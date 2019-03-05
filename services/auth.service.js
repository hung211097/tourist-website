import { Router } from 'routes'
const CONST_KEY = 'persist:tourist-v1'

export function checkLogin(pass) {
	if (_notSupportOrSSL()) {
		return false
	}
	if (!getAccessToken()) {
		if (!pass) {
			Router.pushRoute('login')
		}
		return false
	}
	return true
}

export function getAccessToken() {
	if (_notSupportOrSSL()) {
		return
	}
	const item = window.localStorage.getItem(CONST_KEY)
	return item && JSON.parse(item).token && JSON.parse(JSON.parse(item).token);
}

export function getUserAuth() {
	if (_notSupportOrSSL()) {
		return
	}
	const item = window.localStorage.getItem(CONST_KEY)
	return item && JSON.parse(item).user && JSON.parse(JSON.parse(item).user);
}

function _notSupportOrSSL() {
	return typeof window === 'undefined' || !window.localStorage
}
