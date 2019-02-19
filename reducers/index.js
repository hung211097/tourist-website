import { actionTypes } from '../actions'

export default (state = {}, action) => {
    switch (action.type) {
      case actionTypes.SET_USER:
          return { ...state, user: action.user.me, accessToken:  action.user.access_token}
        default:
            return state
    }
}
