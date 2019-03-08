const APP_URL = process.env.APP_URL

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
