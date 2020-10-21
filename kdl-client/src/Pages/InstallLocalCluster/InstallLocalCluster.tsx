import LogViewer, { Log } from 'Components/LogViewer/LogViewer';
import React, { useEffect, useState } from 'react';
import StatusCircle, {
  States,
} from 'Components/LottieShapes/StatusCircle/StatusCircle';

import { Button } from 'kwc';
import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import ROUTE from 'Constants/routes';
import { ipcRenderer } from 'electron';
import styles from './InstallLocalCluster.module.scss';

const INITIAL_LOG: Log = { text: 'Starting installation...' };

type InstallLocalClusterResponse = {
  text: string;
  finished: boolean;
  isError?: boolean;
};

enum InstallationState {
  INSTALLING = 'INSTALLING',
  OK = 'OK',
  ERR = 'ERR',
}

function getStateCircle(state = '') {
  switch (state) {
    case InstallationState.OK:
      return <StatusCircle animation={States.SUCCESS} label="DONE" />;
    case InstallationState.ERR:
      return <StatusCircle animation={States.ERROR} label="ERROR" />;
    default:
      return <StatusCircle />;
  }
}

function InstallLocalCluster() {
  const [installationState, setInstallationState] = useState<
    InstallationState
  >();
  const [logs, setLogs] = useState<Log[]>([]);

  function startInstallation() {
    setInstallationState(InstallationState.INSTALLING);
    setLogs([INITIAL_LOG]);

    ipcRenderer.send('installLocalCluster');
  }

  useEffect(() => {
    const onInstallLocalClusterReply = (
      _: unknown,
      result: InstallLocalClusterResponse
    ) => {
      result.finished &&
        setInstallationState(
          result.isError ? InstallationState.ERR : InstallationState.OK
        );

      setLogs((prevLogs) => [...prevLogs, result]);
    };

    ipcRenderer.on('installLocalClusterReply', onInstallLocalClusterReply);

    startInstallation();

    return () => {
      ipcRenderer.removeListener(
        'installLocalClusterReply',
        onInstallLocalClusterReply
      );
    };

    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let buttons;
  switch (installationState) {
    case InstallationState.OK:
      buttons = (
        <>
          {/* TODO: redirect to cluster */}
          <Button label="CONNECT NOW" to={ROUTE.HOME} primary />
          <Button label="MAYBE LATER" to={ROUTE.HOME} />
        </>
      );
      break;
    case InstallationState.ERR:
      buttons = (
        <>
          <Button
            label="RETRY INSTALLATION"
            onClick={startInstallation}
            primary
          />
          <Button label="CANCEL" to={ROUTE.HOME} />
        </>
      );
      break;
    default:
      buttons = null;
  }

  return (
    <ColumnPage
      title="Installing Local Cluster"
      subtitle="Konstellation is being installed into your Kubernetes. Please, don't stop or restart your local Kubernetes during the installation."
    >
      <div className={styles.container}>
        <p className={styles.subtitle}>This can take few minutes.</p>
        {getStateCircle(installationState)}
        <LogViewer logs={logs} />
        <div className={styles.buttons}>{buttons}</div>
      </div>
    </ColumnPage>
  );
}

export default InstallLocalCluster;
