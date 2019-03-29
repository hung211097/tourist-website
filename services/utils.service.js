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

  top -= 100
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

export function getCode(id){
  if(id < 10){
    return '0000' + id;
  }
  else if(id < 100){
    return '000' + id
  }
  else if(id < 1000){
    return '00' + id
  }
  else if(id < 10000){
    return '0' + id
  }
  return id
}

export function shrinkCode(string){
  return string.replace(/^0+/, '')
}

export function capitalize(string){
  return string.charAt(0).toUpperCase() + string.substr(1)
}

export function calcTotalPage(total, per_page){
  return total % per_page === 0 ? parseInt(total / per_page) : parseInt(total / per_page) + 1
}
