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
import styles from './InstallLocalServer.module.scss';

const INITIAL_LOG: Log = { text: 'Starting installation...' };

type InstallLocalServerResponse = {
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

function InstallLocalServer() {
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

    ipcRenderer.send('installLocalServer');
  }

  useEffect(() => {
    const onInstallLocalServerReply = (
      _: unknown,
      result: InstallLocalServerResponse
    ) => {
      result.finished &&
        setInstallationState(
          result.isError ? InstallationState.ERR : InstallationState.OK
        );

      setLogs((prevLogs) => [...prevLogs, result]);
    };

    ipcRenderer.on('installLocalServerReply', onInstallLocalServerReply);

    startInstallation();

    return () => {
      ipcRenderer.removeListener(
        'installLocalServerReply',
        onInstallLocalServerReply
      );
    };

    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let actions: JSX.Element[];
  switch (installationState) {
    case InstallationState.OK:
      /* TODO: add Connect to server button */
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
      title="Install Local Server"
      subtitle="A new KDL local server is being installed on your machine. Wait until installation is complete."
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
                    Your local Server is ready to be used. You can stop the
                    Server inside the Server list by clicking on the "STOP"
                    button. Remember that you can only install one local Server
                    in your machine.
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

export default InstallLocalServer;
