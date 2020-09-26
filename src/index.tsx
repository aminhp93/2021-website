import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from 'containers/App';

// Import main styles for this application
import './scss/main.scss';


const render = () => {
  ReactDOM.render(
    <Provider store={window.__store}>      
        <App />
    </Provider>,
    document.getElementById('root')
  );
};

render();
