import {
  GET_OPENED_SERVER,
  GetOpenedServer,
} from 'Graphql/client/queries/getOpenedServer.graphql';

import CopyToClipboard from 'Components/CopyToClipboard/CopyToClipboard';
import React from 'react';
import { SpinnerLinear } from 'kwc';
import styles from './ProjectsBar.module.scss';
import { useQuery } from '@apollo/client';

function ServerDetails() {
  const { data: localData } = useQuery<GetOpenedServer>(GET_OPENED_SERVER);
  const openedServer = localData?.openedServer;

  if (!openedServer) return <SpinnerLinear />;

  return (
    <div className={styles.serverDetails}>
      <div className={styles.serverName}>
        <div className={styles.serverState} />
        <div className={styles.serverNameInput}>{openedServer.name}</div>
      </div>
      {openedServer.url && (
        <div className={styles.serverUrl}>
          <p>{openedServer.url}</p>
          <CopyToClipboard>{openedServer?.url || ''}</CopyToClipboard>
        </div>
      )}
    </div>
  );
}

export default ServerDetails;
