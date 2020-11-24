import { BUTTON_THEMES, Button } from 'kwc';
import LogViewer, { Log } from 'Components/LogViewer/LogViewer';
import React, { useEffect, useState } from 'react';
import StatusCircle, {
  States,
} from 'Components/LottieShapes/StatusCircle/StatusCircle';

import AnimateHeight from 'react-animate-height';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import IconExpand from '@material-ui/icons/Fullscreen';
import IconShrink from '@material-ui/icons/FullscreenExit';
import ROUTE from 'Constants/routes';
import SidebarBottom from 'Components/Layout/Page/DefaultPage/SidebarBottom';
import SlidePresentation from './components/SlidePresentation/SlidePresentation';
import { ipcRenderer } from 'electron';
import slides from './slides';
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
  const [fullscreen, setFullscreen] = useState(false);
  const [installationState, setInstallationState] = useState<
    InstallationState
  >();
  const [logs, setLogs] = useState<Log[]>([]);

  function toggleFullScreen() {
    setFullscreen(!fullscreen);
  }

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

  let actions: JSX.Element[];
  switch (installationState) {
    case InstallationState.OK:
      /* TODO: redirect to cluster */
      actions = [
        <Button
          key="connect"
          className={styles.connectButton}
          label="CONNECT NOW"
          to={ROUTE.HOME}
          primary
        />,
        <Button
          key="later"
          className={styles.laterButton}
          label="MAYBE LATER"
          to={ROUTE.HOME}
        />,
      ];
      break;
    case InstallationState.ERR:
      actions = [
        <Button
          key="back"
          className={styles.backButton}
          label="BACK"
          to={ROUTE.HOME}
        />,
        <Button
          key="retry"
          className={styles.retryButton}
          label="RETRY"
          onClick={startInstallation}
          theme={BUTTON_THEMES.ERROR}
          primary
        />,
      ];
      break;
    default:
      actions = [];
  }

  return (
    <DefaultPage
      title="Install Local Cluster"
      subtitle="Konstellation is being installed into your Kubernetes. Please, don't stop or restart your local Kubernetes during the installation."
      actions={actions}
    >
      <div className={styles.container}>
        <AnimateHeight
          duration={300}
          height={fullscreen ? 0 : 'auto'}
          className={styles.box}
        >
          <div className={styles.slides}>
            <SlidePresentation slides={slides} />
          </div>
        </AnimateHeight>
        <div className={styles.content}>
          <p className={styles.subtitle}>INSTALLING LOG</p>
          <div>
            <Button
              label=""
              onClick={toggleFullScreen}
              className={styles.expandButton}
              Icon={fullscreen ? IconShrink : IconExpand}
            />
          </div>
          <LogViewer logs={logs} />
          <SidebarBottom>{getStateCircle(installationState)}</SidebarBottom>
        </div>
      </div>
    </DefaultPage>
  );
}

export default InstallLocalCluster;
