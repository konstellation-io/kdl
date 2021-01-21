import { Route, Switch } from 'react-router-dom';

import Overview from './pages/Overview/Overview';
import ROUTE from 'Constants/routes';
import React from 'react';
import Tools from './pages/Tools/Tools';
import extensions from 'extensions/extensions';

function ProjectContentRoutes() {
  const extensionPages = extensions.getPages();

  return (
    <Switch>
      <Route exact path={ROUTE.PROJECT_OVERVIEW} component={Overview} />
      <Route exact path={ROUTE.PROJECT_TOOLS} component={Tools} />
      {extensionPages.map((extPage) => (
        <Route
          exact
          key={extPage.route}
          path={extPage.route}
          component={extPage.Component}
        />
      ))}
    </Switch>
  );
}

export default ProjectContentRoutes;
