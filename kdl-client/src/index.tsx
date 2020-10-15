import './index.scss';
import 'kwc/index.css';
import 'Components/TitleBar/TitleBar';
import 'Styles/app.global.scss';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
