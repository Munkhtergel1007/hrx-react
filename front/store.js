 import {applyMiddleware, compose, createStore} from 'redux';
 import thunk from 'redux-thunk';
 import rootReducer from './reducers'
 import promiseMiddleware from './promiseMiddleware';
 const finalCreateStore = compose(
     applyMiddleware(thunk, promiseMiddleware),

 )(createStore);

 export default function configureStore(initialState) {
     return finalCreateStore(rootReducer, initialState);
 }