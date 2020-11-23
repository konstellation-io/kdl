import Cluster, { ClusterBaseProps } from './Cluster';
import ROUTE, { buildRoute } from 'Constants/routes';

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

  const isSignedIn = props.state === RemoteClusterStates.SIGNED_IN;
  const onOpenUrl = isSignedIn
    ? buildRoute.cluster(ROUTE.CLUSTER, props.clusterId)
    : buildRoute.cluster(ROUTE.CLUSTER_LOGIN, props.clusterId);

  return <Cluster {...props} actions={actions} onOpenUrl={onOpenUrl} />;
}

export default RemoteCluster;
