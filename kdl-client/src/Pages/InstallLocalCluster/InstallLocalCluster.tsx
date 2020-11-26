import LogViewer, { Log } from 'Components/LogViewer/LogViewer';
import React, { useEffect, useRef, useState } from 'react';
import StatusCircle, {
  States,
} from 'Components/LottieShapes/StatusCircle/StatusCircle';

import AnimateHeight from 'react-animate-height';
import { Button } from 'kwc';
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

const stateToCircle = new Map([
  [InstallationState.INSTALLING, <StatusCircle />],
  [
    InstallationState.OK,
    <StatusCircle animation={States.SUCCESS} label="DONE" key="ok" />,
  ],
  [
    InstallationState.ERR,
    <StatusCircle animation={States.ERROR} label="ERROR" key="error" />,
  ],
]);

function InstallLocalCluster() {
  const [fullscreen, setFullscreen] = useState(false);
  const statusCircle = useRef<JSX.Element | undefined>(<StatusCircle />);
  const [installationState, setInstallationState] = useState<InstallationState>(
    InstallationState.INSTALLING
  );
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    statusCircle.current = stateToCircle.get(installationState);
  }, [installationState]);

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
      /* TODO: add Connect to cluster button */
      actions = [
        <Button
          key="continue"
          className={styles.continueButton}
          label="CONTINUE"
          to={ROUTE.HOME}
          primary
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
          <Button
            label=""
            onClick={toggleFullScreen}
            className={styles.expandButton}
            Icon={fullscreen ? IconShrink : IconExpand}
          />
          <LogViewer logs={logs} />
          <SidebarBottom>
            <>
              {statusCircle.current}
              <AnimateHeight
                duration={300}
                height={installationState === InstallationState.OK ? 'auto' : 0}
                className={styles.ok}
              >
                <div className={styles.serverReady}>
                  <p className={styles.title}>Server installed and ready!</p>
                  <p className={styles.description}>
                    Curabitur lobortis id lorem id bibendum. Ut id consectetur
                    magna. Quisque volutpat augue enim, pulvinar lobortis nibh
                    lacinia at. Vestibulum nec erat ut mi sollicitudin porttitor
                    id sit amet risus. Nam tempus vel odio vitae aliquam. In
                    imperdiet
                  </p>
                </div>
              </AnimateHeight>
            </>
          </SidebarBottom>
        </div>
      </div>
    </DefaultPage>
  );
}

export default InstallLocalCluster;
