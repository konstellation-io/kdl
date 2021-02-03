import 'kwc/index.css';
import 'Styles/app.global.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';
import 'Styles/react-tabs.scss';
import 'Styles/react-toastify.scss';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import config from './config';

export let SERVER_NAME: string;
export let SERVER_URL: string;
export let KDL_ADMIN_API_HOST: string;

config.then((configJson) => {
  SERVER_NAME = configJson.SERVER_NAME;
  SERVER_URL = configJson.SERVER_URL;
  KDL_ADMIN_API_HOST = configJson.KDL_ADMIN_API_HOST;
  ReactDOM.render(<App />, document.getElementById('root'));
});
