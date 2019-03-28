import fetch from 'isomorphic-fetch'
import { isServer } from 'services/utils.service'
import ApiService from 'services/api.service'
import Router from 'next/router'
import { removeItem } from '../services/local-storage.service'
import { KEY } from '../constants/local-storage'
import { modal } from '../constants'

export const actionTypes = {
  SET_USER: 'SET_USER',
  REDIRECT_AFFTER_LOGIN: 'REDIRECT_AFFTER_LOGIN',
  SAVE_LOCATION: 'SAVE_LOCATION',
  TOGGLE_SHOW_TOUR: 'TOGGLE_SHOW_TOUR',
  LOGOUT: 'LOGOUT',
  SAVE_PROFILE: 'SAVE_PROFILE',
  USE_MODAL: 'USE_MODAL',
}

export const storeKEY = 'tourist-v1'

export const actionDefault = {
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
    }).catch(() => {
      dispatch(logout())
      removeItem(KEY.TOKEN)
      dispatch(useModal({type: modal.EXPIRED, isOpen: true, data: ''}))
    })
  }
}

export const useModal = (data) => {
    return {
        type: actionTypes.USE_MODAL,
        modal: data
    }
}
