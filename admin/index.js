import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Routes from './router/index';
const rootElement = document.getElementById('admin');
require("../static/css/admin.less");
import { Router } from 'react-router-dom';
import configureStore from './store';
import {Provider} from 'react-redux';
import {createBrowserHistory as createHistory} from "history";
let history = createHistory();
let main = window.__INITIAL_STATE__;
const store = configureStore(main);
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Routes />
        </Router>
    </Provider>,
    rootElement
);