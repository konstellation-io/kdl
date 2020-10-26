import React, { useState } from 'react';

import { Button } from 'kwc';
import CheckLocalRequirements from './components/CheckLocalRequirements/CheckLocalRequirements';
import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import ROUTE from 'Constants/routes';
import styles from './CheckLocalClusterRequirements.module.scss';
import { useHistory } from 'react-router-dom';

export enum CheckState {
  PENDING,
  OK,
  ERROR,
}

function CheckLocalClusterRequirements() {
  const [checksState, setChecksState] = useState(CheckState.PENDING);
  const history = useHistory();

  const actions = [
    <Button
      label="INSTALL"
      key="button-1"
      disabled={checksState !== CheckState.OK}
      to={ROUTE.INSTALL_LOCAL_CLUSTER}
      className={styles.installButton}
      primary
    />,
    <Button
      label="CANCEL"
      key="button-2"
      className={styles.cancelButton}
      onClick={() => history.goBack()}
    />,
  ];
  return (
    <ColumnPage
      title="Install local Cluster"
      subtitle="Konstellation Cluster is based on Kubernetes. Kubernetes can run in almost any platform. The local cluster installation is checking if everything is ready to start the installation."
      actions={actions}
    >
      <>
        <p className={styles.checkTitle}>
          {checksState === CheckState.PENDING
            ? 'CHECKING REQUIREMENTS'
            : 'REQUIREMENTS CHECKED'}
        </p>
        <CheckLocalRequirements setChecksState={setChecksState} />
      </>
    </ColumnPage>
  );
}

export default CheckLocalClusterRequirements;
