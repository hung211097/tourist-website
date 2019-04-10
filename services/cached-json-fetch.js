import fetch from 'isomorphic-fetch'
import {
  getAccessToken
} from './auth.service'

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
    let error = new Error(data.msg)
    error.response = response
    error.status = response.status
    error.result = data.msg
    throw error
  })
}

export default async function(url, force = false) {
  // We don't cache anything when server-side rendering.
  // That way if users refresh the page they always get fresh data.

  let token = getAccessToken()
  let authorization = (token) ? token : undefined;
  let options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization
    },
  }

  return fetch(url, options).then(checkStatus).then(parseJSON)
}

export async function httpPost(url, data) {
  let token = getAccessToken()
  let authorization = (token) ? token : undefined;
  return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization
      },
      body: JSON.stringify(data)
    }).then(checkStatus)
    .then(parseJSON)
}

export async function httpPut(url, data) {
  let token = getAccessToken()
  let authorization = (token) ? token : undefined;
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
  let token = getAccessToken()
  let authorization = (token) ? token : undefined;
  return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization
      },
      body: form
    })
    .then(checkStatus)
    .then(parseJSON)
}

export async function httpPutForm(url, form) {
  let token = getAccessToken()
  return fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: token
      },
      body: form
    })
    .then(checkStatus)
    .then(parseJSON)
}

export async function httpDelete(url) {
  let token = getAccessToken()
  return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
    .then(checkStatus)
    .then(parseJSON)
}

export function httpWPGetBlog(url) {
  return fetch(url, {
      method: 'GET'
    }).then(checkStatus)
    .then((response) => {
      return response.json().then(data => {
        data.total = +response.headers.get('X-WP-Total')
        data.totalPage = +response.headers.get('X-WP-TotalPages');
        return data
      })
    })
}

export function httpWPGet(url) {
  return fetch(url, {
      method: 'GET'
    }).then(checkStatus)
    .then((response) => {
      return response.json()
    })
}
