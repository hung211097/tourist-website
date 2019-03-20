import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from '../reducers/index'
import { actionDefault, storeKEY } from '../actions'

const makeConfiguredStore = (reducer, initialState) => createStore(reducer, initialState, applyMiddleware(thunkMiddleware))

export const initStore = (initialState = actionDefault, {isServer, req, debug, storeKey}) => {
    if (isServer) {
        return makeConfiguredStore(reducers, initialState)
    } else {
        // we need it only on client side
        const { persistStore, persistReducer } = require('redux-persist')
        const storage = require('redux-persist/lib/storage').default
        const persistConfig = {
            key: storeKEY,
            storage,
            blacklist: ['isShowTour', 'modal']
        }
        const persistedReducer = persistReducer(persistConfig, reducers)
        const store = makeConfiguredStore(persistedReducer, initialState)
        store.__persistor = persistStore(store)
        return store
    }
}
