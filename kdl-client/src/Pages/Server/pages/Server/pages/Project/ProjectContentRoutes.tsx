import { Route, Switch } from 'react-router-dom';

import Overview from './pages/Overview/Overview';
import ROUTE from 'Constants/routes';
import React from 'react';
import Tools from './pages/Tools/Tools';

function ProjectContentRoutes() {
  return (
    <Switch>
      <Route exact path={ROUTE.PROJECT_OVERVIEW} component={Overview} />
      <Route exact path={ROUTE.PROJECT_TOOLS} component={Tools} />
    </Switch>
  );
}

export default ProjectContentRoutes;
