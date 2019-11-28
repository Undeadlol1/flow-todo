import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// Make app work offline and load faster.
// Learn more about service workers: https://bit.ly/CRA-PWA
// NOTE: disabled because project doesn't need to be
// cached so agressively during active development stage
// if (process.env.NODE_ENV === 'production') serviceWorker.register();
// else serviceWorker.unregister();
serviceWorker.unregister();
