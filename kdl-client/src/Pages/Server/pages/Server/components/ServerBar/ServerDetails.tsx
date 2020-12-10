import {
  GET_OPENED_SERVER,
  GetOpenedServer,
} from 'Graphql/client/queries/getOpenedServer.graphql';

import React from 'react';
import ServerOptions from './components/ServerOptions/ServerOptions';
import { SpinnerLinear } from 'kwc';
import styles from './ServerBar.module.scss';
import { useQuery } from '@apollo/client';

function ServerDetails() {
  const { data: localData } = useQuery<GetOpenedServer>(GET_OPENED_SERVER);
  const openedServer = localData?.openedServer;

  if (!openedServer) return <SpinnerLinear />;

  return (
    <div className={styles.serverDetails}>
      <div className={styles.serverName}>
        <div className={styles.serverState} />
        <div className={styles.serverLabel}>SERVER</div>
        <ServerOptions openedServer={openedServer} />
      </div>
    </div>
  );
}

export default ServerDetails;
