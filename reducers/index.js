import { actionTypes } from '../actions'

export default (state = {}, action) => {
    switch (action.type) {
      case actionTypes.SET_USER:
          return { ...state, user: action.user.me, accessToken:  action.user.access_token}
      case actionTypes.REDIRECT_AFFTER_LOGIN:
          return {
            ...state,
            link_redirect: action.payload
          }
        case actionTypes.SAVE_LOCATION:
          return {
            ...state,
            location: action.payload,
            error: action.error
          }
        default:
          return state
    }
}
