import React, { useEffect } from 'react';

import ClusterBar from './components/ClusterBar/ClusterBar';
import ClusterInfo from './components/ClusterInfo/ClusterInfo';
import Projects from './components/Projects/Projects';
import { RouteClusterParams } from 'Constants/routes';
import styles from './Cluster.module.scss';
import { titlebar } from 'Components/TitleBar/TitleBar';
import useClusters from 'Hooks/useClusters';
import useOpenedCluster from '../../apollo/hooks/useOpenedCluster';
import { useParams } from 'react-router-dom';

function Cluster() {
  const { clusterId } = useParams<RouteClusterParams>();
  const { getCluster } = useClusters();
  const cluster = getCluster(clusterId);

  const { updateOpenedCluster } = useOpenedCluster();

  useEffect(() => {
    if (cluster) {
      updateOpenedCluster(cluster);
      titlebar.updateTitle(`Konstellation - ${cluster.name}`);
    }
  }, [cluster, updateOpenedCluster]);

  useEffect(
    () => () => {
      updateOpenedCluster(null);
      titlebar.updateTitle('Konstellation');
      // We want to execute this on on component mount/unmount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  return (
    <div className={styles.container}>
      <ClusterBar />
      <ClusterInfo />
      <Projects />
    </div>
  );
}

export default Cluster;
