const KEY = {
  notifyID: 'NOTIFY_ID'
}

function setLocalStorage(key, value){
  window.localStorage[key] = value
}

function getLocalStorage(key){
  return window.localStorage[key]
}

export function setIDNotification(value){
  setLocalStorage(KEY.notifyID, value)
}

export function getIDNotification(){
  return getLocalStorage(KEY.notifyID)
}
