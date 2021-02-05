import { ApolloClient, ApolloProvider } from '@apollo/client';
import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';

import NewProject from './pages/NewProject/NewProject';
import NewUser from './pages/NewUser/NewUser';
import ProjectCreation from './pages/ProjectCreation/ProjectCreation';
import ROUTE from 'Constants/routes';
import Server from './pages/Server/Server';
import cache from './apollo/cache';
import GenerateApiToken from './pages/GenerateApiToken/GenerateApiToken';

function ServerClient() {
  // Resets cache on exit client
  useEffect(
    () => () => {
      cache.reset();
    },
    []
  );

  const client = useRef(
    new ApolloClient({
      uri: 'http://localhost:4000/api/v1/query',
      credentials: 'include',
      cache,
    })
  );

  return (
    <ApolloProvider client={client.current}>
      <Switch>
        <Route exact path={ROUTE.NEW_PROJECT} component={NewProject} />
        <Route exact path={ROUTE.NEW_SERVER_USER} component={NewUser} />
        <Route
          exact
          path={ROUTE.CREATION_PROJECT}
          component={ProjectCreation}
        />
        <Route
          exact
          path={ROUTE.GENERATE_USER_API_TOKEN}
          component={GenerateApiToken}
        />
        <Route path={ROUTE.SERVER} component={Server} />
      </Switch>
    </ApolloProvider>
  );
}

export default ServerClient;
