import 'Components/TitleBar/TitleBar';

import { Route, Router, Switch } from 'react-router-dom';

import CheckLocalClusterRequirements from 'Pages/CheckLocalClusterRequirements/CheckLocalClusterRequirements';
import ClusterLogin from 'Pages/ClusterLogin/ClusterLogin';
import ConnectToRemoteCluster from 'Pages/ConnectToRemoteCluster/ConnectToRemoteCluster';
import InstallLocalCluster from 'Pages/InstallLocalCluster/InstallLocalCluster';
import NewCluster from 'Pages/NewCluster/NewCluster';
import ROUTE from 'Constants/routes';
import React from 'react';
import history from './browserHistory';

function App() {
  return (
    <>
      <Router history={history}>
        <Switch>
          {/* <Route default component={InstallLocalCluster} /> */}
          <Route exact path={ROUTE.NEW_CLUSTER} component={NewCluster} />
          <Route
            exact
            path={ROUTE.CHECK_LOCAL_CLUSTER_REQUIREMENTS}
            component={CheckLocalClusterRequirements}
          />
          <Route
            exact
            path={ROUTE.INSTALL_LOCAL_CLUSTER}
            component={InstallLocalCluster}
          />
          <Route
            exact
            path={ROUTE.CONNECT_TO_REMOTE_CLUSTER}
            component={ConnectToRemoteCluster}
          />
          <Route exact path={ROUTE.CLUSTER_LOGIN} component={ClusterLogin} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
