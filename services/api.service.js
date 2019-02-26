import fetchCached, { httpPost } from './cached-json-fetch'
const baseURL = process.env.API_URL

export default () => {
  let services = {
    getLocations: (page = 1, limit = 10, params = {}) => {
      let url = baseURL + `location/getAll?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getLocationsNearCenter: (params = {}) => {
      let url = baseURL + `location/getNearMe`
      return httpPost(url, params)
    },
  }

  return services
}
