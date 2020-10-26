import AddCluster from '../Cluster/AddCluster';
import { Button } from 'kwc';
import { Cluster } from 'Hooks/useClusters';
import IconAdd from '@material-ui/icons/Add';
import React from 'react';
import styles from './ClustersSection.module.scss';

type Props = {
  title: string;
  subtitle: string;
  clusters: Cluster[];
  ClusterComponent: React.FC<any>;
  addClusterRoute?: string;
};
function ClustersSection({
  title,
  subtitle,
  clusters,
  ClusterComponent,
  addClusterRoute,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <p className={styles.title}>{title}</p>
        {addClusterRoute && (
          <Button
            label="ADD CLUSTER"
            Icon={IconAdd}
            className={styles.action}
            to={addClusterRoute}
          />
        )}
      </div>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.clusters}>
        {clusters.map((cluster) => (
          <ClusterComponent
            {...cluster}
            key={cluster.id}
            clusterId={cluster.id}
          />
        ))}
        {addClusterRoute && (
          <AddCluster label="ADD CLUSTER" to={addClusterRoute} />
        )}
      </div>
    </div>
  );
}

export default ClustersSection;
