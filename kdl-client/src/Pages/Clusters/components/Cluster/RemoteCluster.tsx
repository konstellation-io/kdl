import Cluster, { ClusterBaseProps } from './Cluster';

import React from 'react';
import useClusters from 'Hooks/useClusters';

export enum RemoteClusterStates {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
}

export interface RemoteClusterProps extends ClusterBaseProps {
  state: RemoteClusterStates;
  url?: string;
}
export function RemoteCluster(props: RemoteClusterProps) {
  const { getClusterActions } = useClusters();
  const actions = getClusterActions(props.state, props.clusterId);

  return <Cluster {...props} actions={actions} />;
}

export default RemoteCluster;