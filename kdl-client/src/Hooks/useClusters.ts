import ROUTE, { buildRoute } from 'Constants/routes';
import { useEffect, useState } from 'react';

import { Action } from 'Pages/Clusters/components/Cluster/Cluster';
import IconStart from '@material-ui/icons/PlayArrow';
import IconStop from '@material-ui/icons/Stop';
import { LocalClusterStates } from 'Pages/Clusters/components/Cluster/LocalCluster';
import { RemoteClusterStates } from 'Pages/Clusters/components/Cluster/RemoteCluster';
import { ipcRenderer } from 'electron';

export enum ClusterType {
  LOCAL = 'local',
  REMOTE = 'remote',
}
export type Cluster = {
  id: string;
  name: string;
  type: ClusterType;
  state: LocalClusterStates | RemoteClusterStates;
  url?: string;
};

export type AddCluster = {
  name: string;
  type: ClusterType;
  url?: string;
};

function useClusters() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function onStoreUpdate(_: unknown, newClusters: Cluster[]) {
      setClusters(newClusters);
    }

    ipcRenderer.send('subscribeToValue', 'clusters');
    ipcRenderer.on('subscribeToValueReply', onStoreUpdate);

    async function fetchData() {
      const storeClusters = await ipcRenderer.invoke(
        'getStoreValue',
        'clusters'
      );
      setClusters(storeClusters);
      setLoading(false);
    }
    fetchData();

    return () => {
      ipcRenderer.removeListener('subscribeToValueReply', onStoreUpdate);
    };
  }, []);

  function getCluster(id: string): Cluster | undefined {
    return clusters.find((cluster) => cluster.id === id);
  }

  function getClusterActions(
    state: LocalClusterStates | RemoteClusterStates,
    id: string
  ) {
    let actions: Action[] = [];

    switch (state) {
      case RemoteClusterStates.SIGNED_OUT:
        actions = [
          {
            label: 'SIGN IN',
            Icon: IconStart,
            to: buildRoute.cluster(ROUTE.CLUSTER_LOGIN, id),
          },
        ];
        break;
      case RemoteClusterStates.SIGNED_IN:
        actions = [
          {
            label: 'SIGN OUT',
            Icon: IconStop,
            onClick: () => ipcRenderer.send('clusterLogout', id),
          },
        ];
        break;
      case LocalClusterStates.STARTED:
        actions = [
          {
            label: 'STOP',
            Icon: IconStop,
            onClick: () => ipcRenderer.send('stopLocalCluster', id),
          },
        ];
        break;
      case LocalClusterStates.STOPPED:
        actions = [
          {
            label: 'START',
            Icon: IconStart,
            onClick: () => ipcRenderer.send('startLocalCluster', id),
          },
        ];
        break;
      default:
        break;
    }

    return actions;
  }

  return {
    clusters,
    loading,
    getCluster,
    getClusterActions,
  };
}

export default useClusters;
