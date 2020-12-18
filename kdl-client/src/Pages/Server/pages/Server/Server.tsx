import ROUTE, { RouteServerParams } from 'Constants/routes';
import React, { useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';

import Project from './pages/Project/Project';
import Projects from './pages/Projects/Projects';
import ServerBar from './components/ServerBar/ServerBar';
import UserSshKey from './pages/UserSshKey/UserSshKey';
import UserApiTokens from './pages/UserApiToken/UserApiTokens';
import Users from './pages/Users/Users';
import styles from './Server.module.scss';
import { titlebar } from 'Components/TitleBar/TitleBar';
import useOpenedServer from '../../apollo/hooks/useOpenedServer';
import useServers from 'Hooks/useServers';

function Server() {
  const { serverId } = useParams<RouteServerParams>();
  const { getServer } = useServers();
  const server = getServer(serverId);

  const { updateOpenedServer } = useOpenedServer();

  useEffect(() => {
    if (server) {
      updateOpenedServer(server);
      titlebar.updateTitle(`Konstellation - ${server.name}`);
    }
  }, [server, updateOpenedServer]);

  useEffect(
    () => () => {
      updateOpenedServer(null);
      titlebar.updateTitle('Konstellation');
    },
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={styles.container}>
      <ServerBar />
      <Switch>
        <Route exact path={ROUTE.SERVER_USERS} component={Users} />
        <Route exact path={ROUTE.SERVER} component={Projects} />
        <Route exact path={ROUTE.PROJECT} component={Project} />
        <Route exact path={ROUTE.USER_SSH_KEY} component={UserSshKey} />
        <Route exact path={ROUTE.USER_API_TOKENS} component={UserApiTokens} />
      </Switch>
    </div>
  );
}

export default Server;
