import { useEffect, useState } from 'react';

import { ipcRenderer } from 'electron';

export enum ClusterType {
  LOCAL = 'local',
  REMOTE = 'remote',
}
type Cluster = {
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

  async function saveCluster(newCluster: Cluster) {
    await ipcRenderer.invoke('setStoreValue', {
      key: 'clusters',
      value: [...clusters, newCluster],
    });
  }

  return {
    clusters,
    loading,
    saveCluster,
  };
}

export default useClusters;
