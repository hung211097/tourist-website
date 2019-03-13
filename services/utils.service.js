const APP_URL = process.env.APP_URL
import { transports } from '../constants/map-option'

export function isServer() {
  return typeof window === 'undefined'
}

export function convertFullUrl(url) {
  return `${APP_URL}` + url;
}

export function moveToElementId(element) {
  const elm = document.getElementById(element)
  window.scrollTo({
    top: _getElementOffset(elm).top,
    behavior: 'smooth'
  })
}

function _getElementOffset(el) {
  let top = 0
  let left = 0
  let element = el

  // Loop through the DOM tree
  // and add it's parent's offset to get page offset
  do {
    top += element.offsetTop || 0
    left += element.offsetLeft || 0
    element = element.offsetParent
  } while (element)

  return {
    top,
    left
  }
}

export function processMathRoundFix(number, fractionDigits = 1) {
	return parseFloat(number).toFixed(fractionDigits)
}

export function getAirportPoint(routes){
  let airport = []
  for(let i = 0; i < routes.length; i++){
    if(i < routes.length - 1 && routes[i].transport.name_en === transports.AIRWAY){
      airport.push([routes[i], routes[++i]])
    }
  }
  return airport
}
