import Cluster, { ClusterBaseProps } from './Cluster';
import ROUTE, { buildRoute } from 'Constants/routes';

import React from 'react';
import useClusters from 'Hooks/useClusters';

export enum LocalClusterStates {
  STARTED = 'STARTED',
  STOPPED = 'STOPPED',
  STARTING = 'STARTING',
  STOPPING = 'STOPPING',
}

export interface LocalClusterProps extends ClusterBaseProps {
  state: LocalClusterStates;
}
export function LocalCluster(props: LocalClusterProps) {
  const { getClusterActions } = useClusters();
  const actions = getClusterActions(props.state, props.clusterId);

  const clusterReady = props.state === LocalClusterStates.STARTED;
  const onOpenUrl = clusterReady
    ? buildRoute.cluster(ROUTE.CLUSTER, props.clusterId)
    : null;

  return <Cluster {...props} actions={actions} onOpenUrl={onOpenUrl} local />;
}

export default LocalCluster;
