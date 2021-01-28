import './index.scss';
import 'kwc/index.css';
import 'Styles/app.global.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';
import 'Styles/react-tabs.scss';
import 'Styles/react-toastify.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
