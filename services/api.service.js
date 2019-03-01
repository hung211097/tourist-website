import fetchCached, { httpPost } from './cached-json-fetch'
const baseURL = process.env.API_URL

export default () => {
  let services = {
    getLocations: (page = 1, limit = 10, params = {}) => {
      let url = baseURL + `location/getAll?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getLocationsNearCenter: (data, params = {}) => {
      let url = baseURL + `location/getNearMe`
      url += params.tour ? `?tour=${params.tour}` : ''
      return httpPost(url, data)
    },
    getTour: (id) => {
      let url = baseURL + `tour/getById/${id}`
      return fetchCached(url)
    },
    getRouteByTour: (id) => {
      let url = baseURL + `route/getByTour/${id}`
      return fetchCached(url)
    }
  }

  return services
}
