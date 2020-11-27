import {
  GET_OPENED_CLUSTER,
  GetOpenedCluster,
} from 'Graphql/client/queries/getOpenedCluster.graphql';

import React from 'react';
import ServerOptions from './components/ServerOptions/ServerOptions';
import { SpinnerLinear } from 'kwc';
import styles from './ClusterBar.module.scss';
import { useQuery } from '@apollo/client';

function ClusterDetails() {
  const { data: localData } = useQuery<GetOpenedCluster>(GET_OPENED_CLUSTER);
  const openedCluster = localData?.openedCluster;

  if (!openedCluster) return <SpinnerLinear />;

  return (
    <div className={styles.clusterDetails}>
      <div className={styles.clusterName}>
        <div className={styles.clusterState} />
        <div className={styles.serverLabel}>SERVER</div>
        <ServerOptions openedCluster={openedCluster} />
      </div>
    </div>
  );
}

export default ClusterDetails;
