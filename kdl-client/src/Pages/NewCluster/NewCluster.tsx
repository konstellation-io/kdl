import Cluster, { DIRECTION } from './components/Cluster/Cluster';

import { Button } from 'kwc';
import ClusterOption from './components/ClusterOption/ClusterOption';
import ROUTE from 'Constants/routes';
import React from 'react';
import styles from './NewCluster.module.scss';
import ActionsBar from '../../Components/Layout/ActionsBar/ActionsBar';

function NewCluster() {
  const actions = <Button label="CANCEL" to={ROUTE.HOME} />;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Add a Cluster</h1>
        <h3 className={styles.subtitle}>
          Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras
          ullamcorper bibendum bibendum.
        </h3>
        <div className={styles.clusters}>
          <ClusterOption
            title="Connect to a Remote Cluster"
            subtitle="Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. "
            actionLabel="CONNECT"
            to={ROUTE.CONNECT_TO_REMOTE_CLUSTER}
            Cluster={<Cluster direction={DIRECTION.UP} />}
          />
          <ClusterOption
            title="Install a Local Cluster"
            subtitle="Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae."
            actionLabel="INSTALL"
            to={ROUTE.CHECK_LOCAL_CLUSTER_REQUIREMENTS}
            Cluster={<Cluster direction={DIRECTION.DOWN} />}
          />
        </div>
      </div>
      <ActionsBar className={styles.actionBar} centerActions>
        {actions}
      </ActionsBar>
    </div>
  );
}

export default NewCluster;
