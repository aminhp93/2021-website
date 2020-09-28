import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from 'containers/App';

// Import main styles for this application

import 'antd/dist/antd.css';
import './scss/main.scss';
import store from 'store';

console.log(13, process, process.env)

const render = () => {
  ReactDOM.render(
    <Provider store={store}>      
        <App />
    </Provider>,
    document.getElementById('root')
  );
};

render();
