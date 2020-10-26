import Cluster, { ClusterBaseProps } from './Cluster';

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

  return <Cluster {...props} actions={actions} local />;
}

export default LocalCluster;
