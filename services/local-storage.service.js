const KEY = {
  notifyID: 'NOTIFY_ID'
}

export function setLocalStorage(key, value){
  window.localStorage[key] = value
}

export function getLocalStorage(key){
  return window.localStorage[key]
}

export function removeItem(key){
  return window.localStorage.removeItem(key);
}

export function setIDNotification(value){
  setLocalStorage(KEY.notifyID, value)
}

export function getIDNotification(){
  return getLocalStorage(KEY.notifyID)
}
