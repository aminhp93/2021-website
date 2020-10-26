import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import history from 'utils/history';
import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';

import App from 'containers/App';

// Import main styles for this application

import 'antd/dist/antd.css';
import './scss/main.scss';
import store from 'store';

const render = () => {
  ReactDOM.render(
    <Provider store={store}>   
      <App />
    </Provider>,
    document.getElementById('root')
  );
};

render();
