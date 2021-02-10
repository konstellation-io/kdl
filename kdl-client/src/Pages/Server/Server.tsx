import React from 'react';
import { RouteServerParams } from 'Constants/routes';
import styles from './Server.module.scss';
import { useParams } from 'react-router-dom';
import useServers from '../../Hooks/useServers';

function Server() {
  const { serverId } = useParams<RouteServerParams>();
  const { getServer } = useServers();
  const server = getServer(serverId);

  return <webview src={server?.url} className={styles.container} />;
}

export default Server;
