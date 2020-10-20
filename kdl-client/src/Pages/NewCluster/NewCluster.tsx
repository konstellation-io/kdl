import Cluster, { DIRECTION } from './components/Cluster/Cluster';

import BGPage from 'Components/Layout/Page/BGPage/BGPage';
import { Button } from 'kwc';
import ClusterOption from './components/ClusterOption/ClusterOption';
import ROUTE from 'Constants/routes';
import React from 'react';
import file from './bg.mp4';
import styles from './NewCluster.module.scss';

function NewCluster() {
  return (
    <BGPage
      title="Add a Cluster"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum. "
      bgFile={file}
    >
      <div className={styles.container}>
        <div className={styles.clusters}>
          <ClusterOption
            title="Connect to a Remote Cluster"
            subtitle="Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing vitae est. Sed nec felis."
            actionLabel="CONNECT"
            to={ROUTE.CONNECT_TO_REMOTE_CLUSTER}
            Cluster={<Cluster direction={DIRECTION.UP} />}
          />
          <ClusterOption
            title="Install a Local Cluster"
            subtitle="Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae ullamcorper metus. Sed sollicitudin ipsum quis nunc sollicitudin ultrices."
            actionLabel="INSTALL"
            to={ROUTE.CHECK_LOCAL_CLUSTER_REQUIREMENTS}
            Cluster={<Cluster direction={DIRECTION.DOWN} />}
          />
        </div>
        <div className={styles.cancel}>
          <Button label="CANCEL" to={ROUTE.HOME} />
        </div>
      </div>
    </BGPage>
  );
}

export default NewCluster;
