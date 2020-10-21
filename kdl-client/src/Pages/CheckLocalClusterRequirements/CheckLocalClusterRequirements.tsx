import React, { useState } from 'react';

import { Button } from 'kwc';
import CheckLocalRequirements from './components/CheckLocalRequirements/CheckLocalRequirements';
import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import ROUTE from 'Constants/routes';
import styles from './CheckLocalClusterRequirements.module.scss';

export enum CheckState {
  PENDING,
  OK,
  ERROR,
}

function CheckLocalClusterRequirements() {
  const [checksState, setChecksState] = useState(CheckState.PENDING);

  return (
    <ColumnPage
      title="Install local Cluster"
      subtitle="Konstellation Cluster is based on Kubernetes. Kubernetes can run in almost any platform. The local cluster installation is checking if everything is ready to start the installation."
    >
      <div>
        <p className={styles.checkTitle}>
          {checksState === CheckState.PENDING
            ? 'CHECKING REQUIREMENTS'
            : 'REQUIREMENTS CHECKED'}
        </p>
        <CheckLocalRequirements setChecksState={setChecksState} />
        <div className={styles.buttons}>
          <Button
            label="INSTALL"
            disabled={checksState !== CheckState.OK}
            to={ROUTE.INSTALL_LOCAL_CLUSTER}
            primary
          />
          <Button label="CANCEL" to={ROUTE.NEW_CLUSTER} />
        </div>
      </div>
    </ColumnPage>
  );
}

export default CheckLocalClusterRequirements;
