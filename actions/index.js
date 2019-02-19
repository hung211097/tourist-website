import fetch from 'isomorphic-fetch'
import Router from 'next/router'
import { isServer } from 'services/utils.service'

export const actionTypes = {
  
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
