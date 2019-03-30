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
      url += params.isUnique ? "&isUniqueTour=true" : ''
      url += params.sortBy ? `&sortBy=${params.sortBy}` : ''
      url += params.sortType ? `&sortType=${params.sortType}` : ''
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
    getBookTourHistoryById: (id, params = {}) => {
      let url = baseURL + `book_tour/getHistoryBookTourById/${id}`
      url += params.isTour ? "?tour=true" : ''
      return fetchCached(url)
    },
    getBookTourHistoryByCode: (code, params = {}) => {
      let url = baseURL + `book_tour/getHistoryBookTourByCode/${code}`
      url += params.isTour ? "?tour=true" : ''
      return fetchCached(url)
    },
    getPassengersInBookTour: (id, page = 1, limit = 5) => {
      let url = baseURL + `book_tour/getPassengerInBookTourHistory/${id}?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getBookToursHistory: (page = 1, limit = 5) => {
      let url = baseURL + `book_tour/getHistoryBookTourByUser?page=${page}&per_page=${limit}`
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
    },
    cancelTour: (data) => {
      let url = baseURL + `request_cancel_booking/create`
      return httpPost(url, data)
    },
    increaseView: (id) => {
      let url = baseURL + `tour_turn/increaseView/${id}`
      return fetchCached(url)
    },
    search: (page = 1, limit = 5, params={}) => {
      let url = baseURL + `tour_turn/search?page=${page}&per_page=${limit}`
      url += params.name ? `&name=${params.name}` : ''
      url += params.price ? `&price=${params.price}` : ''
      url += params.date ? `&date=${params.date}` : ''
      url += params.rating ? `&rating=${params.rating}` : ''
      url += params.lasting ? `&lasting=${params.lasting}` : ''

      url += params.sortBy ? `&sortBy=${params.sortBy}` : ''
      url += params.sortType ? `&sortType=${params.sortType}` : ''
      return fetchCached(url)
    },
    getAutoSuggestTour: (name, limit = 10) => {
      let url = baseURL + `tour/searchByName?name=${name}&per_page=${limit}`
      return fetchCached(url)
    }
  }

  return services
}
