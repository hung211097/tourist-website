import { actionTypes } from '../actions'

export default (state = {isShowTour: false}, action) => {
    switch (action.type) {
      case actionTypes.SET_USER:
          return { ...state, user: action.user.profile, token:  action.user.token}
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
      case actionTypes.SAVE_PROFILE:
          return {
              ...state,
              user: action.payload
          }
        case actionTypes.TOGGLE_SHOW_TOUR:
          return {
            ...state,
            isShowTour: action.payload
          }
      case actionTypes.USE_MODAL:
          return {
            ...state,
            modal: action.modal
          }
      case actionTypes.LOGOUT:
        let {user, token, ...remain} = state
        return remain
      case actionTypes.ADD_RECOMMEND_LOCATION:
          const location = action.payload
          const index = state.recommendLocation.findIndex(function(p) {
              return p.id == location.id
          })
          if (index === -1) {
              state.recommendLocation = [...state.recommendLocation, location]
          }
          return{
            ...state
          }
      case actionTypes.REMOVE_RECOMMEND_LOCATION:
          const location_2 = action.payload
          return {
              ...state,
              recommendLocation: state.recommendLocation.filter((item) => {return item.id !== location_2.id})
          }
      case actionTypes.REMOVE_ALL_RECOMMEND_LOCATION:
          return {
              ...state,
              recommendLocation: []
          }
      case actionTypes.ADD_INFO_PASSENGERS:
          return {
            ...state,
            passengerInfo: action.payload
          }
        default:
          return state
    }
}
