import fetchCached, { httpPost, httpPutForm, httpWPGetBlog, httpWPGet, httpPut} from './cached-json-fetch'
const baseURL = process.env.API_URL
const cmsURL = process.env.API_CMS_URL
const site_captcha_key = process.env.KEY_GOOGLE_RECAPTCHA
const site_secret_key = process.env.KEY_GOOGLE_RECAPTCHA_SECRET
const convert_currency_key = process.env.KEY_CONVERT_CURRENCY
const convertURL = process.env.API_CONVERT_CURRENCY
import {
    convertWptoPost,
    convertWptoPostDetail,
    convertWpTag,
    convertWpTags
} from 'services/utils.service'

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
      url += params.isDiscount ? "&isDiscount=true" : ''
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
    getReviews: (id, page = 1, limit = 5, params = {}) => {
      let url = baseURL + `reviews/getByTour/${id}?page=${page}&per_page=${limit}`
      if(params.offset){
        url = baseURL + `reviews/getByTour/${id}?offset=${params.offset}&per_page=${limit}`
      }
      return fetchCached(url)
    },
    getBlogs: (page = 1, limit = 4, params = {}) => {
        params = params || {}
        let url = cmsURL + `posts?_embed&context=embed&page=${page}&per_page=${limit}`
        // url += offset >= 0 ? `&offset=${offset}` : ''
        url += params.categories ? `&categories=${params.categories}` : ''
        url += params.tags ? `&tags=${params.tags}` : ''
        url += params.author ? `&author=${params.author}` : ''
        url += params.exclude ? `&exclude=${params.exclude}` : ''
        url += params.keyword ? `&search=${params.keyword}` : ''
        return httpWPGetBlog(url).then((data) => {
            let res = {}
            res.total = data.total
            res.totalPage = data.totalPage
            res.nextPage = res.totalPage <= page ? null : ++page
            res.data = convertWptoPost(data)
            return res
        })
    },
    getBlogsDetail: (id) => {
        return httpWPGet(cmsURL + `posts/${id}?_embed`).then((data) => {
            return convertWptoPostDetail(data)
        })
    },
    getTagsBlog: (id) => {
      return httpWPGet(cmsURL + `tags?post=${id}`).then((data) => {
          return convertWpTags(data)
      })
    },
    getTagsInfo: (id) => {
      return httpWPGet(cmsURL + `tags/${id}`).then((data) => {
          return convertWpTag(data)
      })
    },
    getTourTurnByCountry: (id, page = 1, limit = 4, params = {}) => {
      let url = baseURL + `tour_classification/getTourTurnByCountry/${id}?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getTourTurnByProvince: (id, page = 1, limit = 4, params = {}) => {
      let url = baseURL + `tour_classification/getTourTurnByProvince/${id}?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getTourTurnByType: (id, page = 1, limit = 4, params = {}) => {
      let url = baseURL + `tour_classification/getTourTurnByType/${id}?page=${page}&per_page=${limit}`
      return fetchCached(url)
    },
    getCurrentRoute: (data) => {
      let url = baseURL + `route/getCurrentRoute`
      return httpPost(url, data)
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
    },
    getRecommendationTour: (data) => {
      let url = baseURL + `tour_turn/getRecommendation`
      return httpPost(url, data)
    },
    verifyCaptcha: (data) => {
      let url = baseURL + `verifyCaptcha`
      return httpPost(url, data)
    },
    writeReview: (data) => {
      let url = baseURL + `reviews/create`
      return httpPost(url, data)
    },
    getRateCurrency: () => {
      let url = convertURL + `live?access_key=${convert_currency_key}&currencies=USD,VND&format=1`
      return httpWPGet(url)
    }
  }

  return services
}
