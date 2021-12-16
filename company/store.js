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


/*
import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducers";
import reduxThunk from "redux-thunk";

export default createStore(rootReducer, {}, applyMiddleware(reduxThunk));*/