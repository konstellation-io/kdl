import { Button } from 'kwc';
import ROUTE from 'Constants/routes';
import React from 'react';
import styles from './Clusters.module.scss';
import useClusters from 'Hooks/useClusters';

function Clusters() {
  const { clusters } = useClusters();

  return (
    <div className={styles.container}>
      {clusters.map((cluster, idx) => (
        <div key={idx}>
          <p>{`TYPE: ${cluster.type}`}</p>
          <p>{`URL: ${cluster.url || 'none'}`}</p>
        </div>
      ))}
      <Button label="ADD CLUSTER" to={ROUTE.NEW_CLUSTER} />
    </div>
  );
}

export default Clusters;
