import './index.scss';
import 'kwc/index.css';
import 'Components/TitleBar/TitleBar';
import 'Styles/app.global.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';
import 'Styles/react-tabs.scss';
import 'Styles/react-toastify.scss';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

// TODO: review https://github.com/apollographql/react-apollo/issues/3635
//       in order to maintain React.StrictMode
ReactDOM.render(<App />, document.getElementById('root'));
