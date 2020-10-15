import 'Components/TitleBar/TitleBar';

import { Route, Router, Switch } from 'react-router-dom';

import Home from 'Pages/Home/Home';
import React from 'react';
import history from './browserHistory';

function App() {
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route default>
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
