export function setSessionStorage(key, value){
  window.sessionStorage[key] = value
}

export function getSessionStorage(key){
  return window.sessionStorage[key]
}

export function removeItem(key){
  return window.sessionStorage.removeItem(key);
}
