/* eslint-disable no-console */
export default (endpoint, method = 'get', body) => {
  const { REACT_APP_PATH_PREFIX } = process.env

  const pathPrefix = typeof REACT_APP_PATH_PREFIX !== 'undefined'
    ? `/${REACT_APP_PATH_PREFIX}`
    : ''

  // note: there should be a slash on either side of 'api' for the md's,
  // but just on the right for local machines.
  const target = `${window.location.origin}${pathPrefix}api/${endpoint}`

  return (
    fetch(target, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method,
      body: JSON.stringify(body),
    })
      .catch((err) => {
        console.log('Fetch Error :-S', err);
      })

  )
}

export function apiCallReturn(endpoint, method = 'get', body) {
  const { REACT_APP_PATH_PREFIX } = process.env

  const pathPrefix = typeof REACT_APP_PATH_PREFIX !== 'undefined'
    ? `/${REACT_APP_PATH_PREFIX}`
    : ''

  const target = `${window.location.origin}${pathPrefix}api/${endpoint}`

  return fetch(target, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((res) => res)
    .catch((err) => {
      console.log('Fetch Error :-S', err);
    })
}
