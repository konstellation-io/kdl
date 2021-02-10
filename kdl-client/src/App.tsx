import 'Components/TitleBar/TitleBar';

import React, { useEffect } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';

import CheckLocalServerRequirements from 'Pages/CheckLocalServerRequirements/CheckLocalServerRequirements';
import ConnectToRemoteServer from 'Pages/ConnectToRemoteServer/ConnectToRemoteServer';
import InstallLocalServer from 'Pages/InstallLocalServer/InstallLocalServer';
import NewServer from 'Pages/NewServer/NewServer';
import ROUTE from 'Constants/routes';
import Server from './Pages/Server/Server';
import Servers from 'Pages/Servers/Servers';
import { SpinnerCircular } from 'kwc';
import history from './browserHistory';
import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';
import useServers from 'Hooks/useServers';

function onMainProcessError(_: unknown, message: string) {
  toast.error(message, {
    autoClose: false,
  });
}

function App() {
  const { servers, loading } = useServers();
  const noServers = servers.length === 0;

  // Add main process errors listener
  useEffect(() => {
    ipcRenderer.on('mainProcessError', onMainProcessError);

    return () => {
      ipcRenderer.removeListener('mainProcessError', onMainProcessError);
    };
  }, []);

  if (loading) return <SpinnerCircular />;

  return (
    <>
      <Router history={history}>
        <Switch>
          {noServers && (
            <Redirect exact from={ROUTE.HOME} to={ROUTE.NEW_SERVER} />
          )}

          <Route exact path={ROUTE.NEW_SERVER} component={NewServer} />
          <Route
            exact
            path={ROUTE.CHECK_LOCAL_SERVER_REQUIREMENTS}
            component={CheckLocalServerRequirements}
          />
          <Route
            exact
            path={ROUTE.INSTALL_LOCAL_SERVER}
            component={InstallLocalServer}
          />
          <Route
            exact
            path={ROUTE.CONNECT_TO_REMOTE_SERVER}
            component={ConnectToRemoteServer}
          />
          <Route exact path={ROUTE.SERVER} component={Server} />
          <Route default path={ROUTE.HOME} component={Servers} />
        </Switch>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        transition={Slide}
        limit={1}
      />
      <div id="chartjs-tooltip">
        <table />
      </div>
    </>
  );
}

export default App;
