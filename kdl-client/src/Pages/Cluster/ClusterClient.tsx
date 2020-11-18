import { ApolloClient, ApolloProvider } from '@apollo/client';
import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';

import Cluster from './pages/Cluster/Cluster';
import NewProject from './pages/NewProject/NewProject';
import Project from './pages/Project/Project';
import ROUTE from 'Constants/routes';
import cache from './apollo/cache';

function ClusterClient() {
  // Resets cache on exit client
  useEffect(
    () => () => {
      cache.reset();
    },
    []
  );

  const client = useRef(
    new ApolloClient({
      uri: 'http://dev.kdl.local:4000/graphql',
      credentials: 'include',
      cache,
    })
  );

  return (
    <ApolloProvider client={client.current}>
      <Switch>
        <Route exact path={ROUTE.CLUSTER} component={Cluster} />
        <Route path={ROUTE.NEW_PROJECT} component={NewProject} />
        <Route exact path={ROUTE.PROJECT} component={Project} />
      </Switch>
    </ApolloProvider>
  );
}

export default ClusterClient;
