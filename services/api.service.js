import fetchCached, { httpPost, httpPutForm, httpPut} from './cached-json-fetch'
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
    getTours: (page = 1, limit = 10, params = {}) => {
      let url = baseURL + `tour/getAll?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getToursTurn: (page = 1, limit = 10, params = {}) => {
      let url = baseURL + `tour_turn/getAll?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getToursTurnId: (id) => {
      let url = baseURL + `tour_turn/getById/${id}`
      return fetchCached(url)
    },
    getRouteByTour: (id) => {
      let url = baseURL + `route/getByTour/${id}`
      return fetchCached(url)
    },
    getImageByTour: (id) => {
      let url = baseURL + `tour_image/getByTour/${id}`
      return fetchCached(url)
    },
    getCurrentProfile: () => {
      return fetchCached(baseURL + `user/me`)
    },
    getStatisticNumber: () => {
      let url = baseURL + `getNumOfTourAndLocation`
      return fetchCached(url)
    },
    register: (data) => {
      let url = baseURL + `user/register`
      return httpPost(url, data)
    },
    login: (data) => {
      let url = baseURL + `user/login`
      return httpPost(url, data)
    },
    logout: () => {
      let url = baseURL + `user/logout`
      return fetchCached(url)
    },
    updateProfile: (data) => {
      let url = baseURL + `user/update`
      return httpPutForm(url, data)
    },
    updatePassword: (data) => {
      let url = baseURL + `user/updatePassword`
      return httpPut(url, data)
    },
    sendRequest: (data) => {
      let url = baseURL + `request/create`
      return httpPost(url, data)
    },
    forgetPassword: (data) => {
      let url = baseURL + `user/forgetPassword`
      return httpPost(url, data)
    },
    bookTour: (data) => {
      let url = baseURL + `book_tour/book_new_tour`
      return httpPost(url, data)
    }
  }

  return services
}
