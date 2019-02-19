import fetch from 'isomorphic-fetch'

function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null
  }
  return response.json()
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  return response.json().then((data) => {
    let error = new Error(data.message)
    error.response = response
    error.status = response.status
    error.result = data.result
    throw error
  })
}

export default async function(url, force = false) {
  // We don't cache anything when server-side rendering.
  // That way if users refresh the page they always get fresh data.

  // let token = (await import('./auth.service')).getAccessToken()
  let authorization = (token) ? ('JWT ' + token) : null;
  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization
    }
  }

  return fetch(url, options).then(checkStatus).then(parseJSON)
}

export async function httpPost(url, data) {
  let token = (await import('./auth.service')).getAccessToken()
  let authorization = (token) ? ('JWT ' + token) : null;
  return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization
      },
      body: JSON.stringify(data)
    }).then(checkStatus)
    .then(parseJSON)
}

export async function httpPut(url, data) {
  let token = (await import('./auth.service')).getAccessToken()
  let authorization = (token) ? ('JWT ' + token) : '';
  return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization
      },
      body: JSON.stringify(data)
    }).then(checkStatus)
    .then(parseJSON)
}

export async function httpPostForm(url, form) {
  let token = (await import('./auth.service')).getAccessToken()
  return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'JWT ' + token
      },
      body: form
    })
    .then(checkStatus)
    .then(parseJSON)
}

export async function httpPutForm(url, form) {
  let token = (await import('./auth.service')).getAccessToken()
  return fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'JWT ' + token
      },
      body: form
    })
    .then(checkStatus)
    .then(parseJSON)
}

export async function httpDelete(url) {
  let token = (await import('./auth.service')).getAccessToken()
  return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + token
      }
    })
    .then(checkStatus)
    .then(parseJSON)
}
