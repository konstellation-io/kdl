import { LocalCluster, RemoteCluster } from './components/Cluster/Cluster';
import React, { useEffect, useState } from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import useClusters, { Cluster, ClusterType } from 'Hooks/useClusters';

import ClustersBar from './components/ClustersBar/ClustersBar';
import ClustersSection from './components/ClustersSection/ClustersSection';
import ROUTE from 'Constants/routes';
import styles from './Clusters.module.scss';
import { useForm } from 'react-hook-form';

type FormData = {
  clusterSearch: string;
};

function Clusters() {
  const { clusters } = useClusters();
  const [filteredClusters, setFilteredClusters] = useState<Cluster[]>(clusters);

  const { setValue, unregister, register, watch } = useForm<FormData>({
    defaultValues: { clusterSearch: '' },
  });

  useEffect(() => {
    register('clusterSearch');
    return () => unregister('clusterSearch');
  }, [register, unregister, setValue]);

  const clusterSearch = watch('clusterSearch');
  useEffect(() => {
    setFilteredClusters(
      clusters.filter(
        (cluster) =>
          cluster.type === ClusterType.LOCAL ||
          cluster.url?.includes(clusterSearch)
      )
    );
  }, [clusters, clusterSearch]);

  const localClusters: Cluster[] = clusters.filter(
    (cluster) => cluster.type === ClusterType.LOCAL
  );
  const filteredRemoteClusters = filteredClusters.filter(
    (cluster) => cluster.type === ClusterType.REMOTE
  );
  const nClusters = localClusters.length + filteredRemoteClusters.length;

  return (
    <div className={styles.container}>
      <ClustersBar setValue={setValue} nClusters={nClusters} />
      <div className={styles.content}>
        <ClustersSection
          title="LOCAL CLUSTER"
          subtitle="ONLY ONE LOCAL CLUSTER IS AVAILABLE IN KONSTELLATION"
          clusters={localClusters}
          ClusterComponent={LocalCluster}
          addClusterRoute={
            localClusters.length === 0
              ? ROUTE.CHECK_LOCAL_CLUSTER_REQUIREMENTS
              : undefined
          }
        />
        <ClustersSection
          title="REMOTE CLUSTERS"
          subtitle="YOU MAY HAVE AS MANY CLUSTERS AS YOU WANT"
          clusters={filteredRemoteClusters}
          ClusterComponent={RemoteCluster}
          addClusterRoute={ROUTE.CONNECT_TO_REMOTE_CLUSTER}
        />
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        transition={Slide}
        limit={1}
      />
    </div>
  );
}

export default Clusters;
