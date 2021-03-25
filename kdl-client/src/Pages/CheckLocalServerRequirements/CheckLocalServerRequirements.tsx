import React, { useState } from 'react';

import { Button } from 'kwc';
import CheckLocalRequirements from './components/CheckLocalRequirements/CheckLocalRequirements';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import ROUTE from 'Constants/routes';
import styles from './CheckLocalServerRequirements.module.scss';
import { useHistory } from 'react-router-dom';

export enum CheckState {
  PENDING,
  OK,
  ERROR,
}

function CheckLocalServerRequirements() {
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
      to={ROUTE.INSTALL_LOCAL_SERVER}
      className={styles.installButton}
      primary
    />,
  ];
  return (
    <DefaultPage
      title="Install local Server"
      subtitle="Installing a local server allows the user to create fully functional KDL projects. You can stop the server at any time to free up resources."
      actions={actions}
    >
      <div className={styles.container}>
        <p className={styles.title}>Checking requirements</p>
        <p className={styles.description}>
          Before installing the local Server in your machine, some checks must
          be done. Installation will be done within a Kubernetes environment and
          may require the installation of different tools.
        </p>
        <CheckLocalRequirements setChecksState={setChecksState} />
      </div>
    </DefaultPage>
  );
}

export default CheckLocalServerRequirements;
