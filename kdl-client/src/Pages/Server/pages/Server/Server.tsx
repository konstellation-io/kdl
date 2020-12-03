import React, { useEffect } from 'react';

import Projects from './components/Projects/Projects';
import ProjectsBar from './components/ProjectsBar/ProjectsBar';
import { RouteServerParams } from 'Constants/routes';
import ServerBar from './components/ServerBar/ServerBar';
import styles from './Server.module.scss';
import { titlebar } from 'Components/TitleBar/TitleBar';
import useOpenedServer from '../../apollo/hooks/useOpenedServer';
import { useParams } from 'react-router-dom';
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
      <ProjectsBar />
      <Projects />
    </div>
  );
}

export default Server;
