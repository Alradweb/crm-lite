import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import store from './redux/store'
import App from './App';

store.subscribe(() => {
    localStorage['auth-store'] = JSON.stringify(store.getState());
});
const app = (
    <Provider store={store}>
        <App/>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

