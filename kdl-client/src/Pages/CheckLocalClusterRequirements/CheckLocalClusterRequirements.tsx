import React, { useState } from 'react';

import { Button } from 'kwc';
import CheckLocalRequirements from './components/CheckLocalRequirements/CheckLocalRequirements';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
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
      label="CANCEL"
      key="button-2"
      className={styles.cancelButton}
      onClick={() => history.goBack()}
    />,
    <Button
      label="INSTALL"
      key="button-1"
      disabled={checksState !== CheckState.OK}
      to={ROUTE.INSTALL_LOCAL_CLUSTER}
      className={styles.installButton}
      primary
    />,
  ];
  return (
    <DefaultPage
      title="Install local Cluster"
      subtitle="Konstellation Cluster is based on Kubernetes. Kubernetes can run in almost any platform. The local cluster installation is checking if everything is ready to start the installation."
      actions={actions}
    >
      <div className={styles.container}>
        <p className={styles.title}>Checking requirements</p>
        <p className={styles.description}>
          In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam
          volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam
          vel iaculis mauris. Sed ullamcorper tellus.
        </p>
        <CheckLocalRequirements setChecksState={setChecksState} />
      </div>
    </DefaultPage>
  );
}

export default CheckLocalClusterRequirements;
