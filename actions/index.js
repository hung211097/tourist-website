import fetch from 'isomorphic-fetch'
import Router from 'next/router'
import { isServer } from 'services/utils.service'
import ApiService from 'services/api.service'

export const actionTypes = {
  SET_USER: 'SET_USER',
  REDIRECT_AFFTER_LOGIN: 'REDIRECT_AFFTER_LOGIN',
  SAVE_LOCATION: 'SAVE_LOCATION',
  TOGGLE_SHOW_TOUR: 'TOGGLE_SHOW_TOUR',
  LOGOUT: 'LOGOUT',
  SAVE_PROFILE: 'SAVE_PROFILE'
}

export const storeKEY = 'tourist-v1'

export const actionDefault = {
    carts: [],
    userProfile: {}
}

export const authLogin = (user, bool = false) => {
    return {
        type: actionTypes.SET_USER,
        user: user
    }
}

export const loadSuccess = () => {
    return {
        type: actionTypes.DATA_LOAD_SUCCESS
    }
}

export const saveRedirectUrl = (url) => {
    return {
        type: actionTypes.REDIRECT_AFFTER_LOGIN,
        payload: url
    }
}

export const saveLocation = (location, err) => {
    return {
        type: actionTypes.SAVE_LOCATION,
        payload: location,
        error: err
    }
}

export const toggleShowTour = (isShow) => {
    return {
        type: actionTypes.TOGGLE_SHOW_TOUR,
        payload: isShow,
    }
}

export const logout = () => {
    return {
        type: actionTypes.LOGOUT,
        user: ''
    }
}

export const saveProfile = () => {
  return (dispatch) => {
    let apiService = ApiService()
    apiService.getCurrentProfile().then((user) => {
        dispatch({
            type: actionTypes.SAVE_PROFILE,
            payload: user.profile
        })
    })
  }
}
