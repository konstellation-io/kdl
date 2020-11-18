import {
  GET_OPENED_CLUSTER,
  GetOpenedCluster,
} from 'Graphql/client/queries/getOpenedCluster.graphql';

import CopyToClipboard from 'Components/CopyToClipboard/CopyToClipboard';
import React from 'react';
import { SpinnerLinear } from 'kwc';
import styles from './ClusterInfo.module.scss';
import { useQuery } from '@apollo/client';

function ClusterDetails() {
  const { data: localData } = useQuery<GetOpenedCluster>(GET_OPENED_CLUSTER);
  const openedCluster = localData?.openedCluster;

  if (!openedCluster) return <SpinnerLinear />;

  return (
    <div className={styles.clusterDetails}>
      <div className={styles.clusterName}>
        <div className={styles.clusterState} />
        <div className={styles.clusterNameInput}>{openedCluster.name}</div>
      </div>
      {openedCluster.url && (
        <div className={styles.clusterUrl}>
          <p>{openedCluster.url}</p>
          <CopyToClipboard>{openedCluster?.url || ''}</CopyToClipboard>
        </div>
      )}
    </div>
  );
}

export default ClusterDetails;
