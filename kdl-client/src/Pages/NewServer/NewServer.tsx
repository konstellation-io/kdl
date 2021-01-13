import Server, { DIRECTION } from './components/Server/Server';

import ActionsBar from '../../Components/Layout/ActionsBar/ActionsBar';
import { Button } from 'kwc';
import ROUTE from 'Constants/routes';
import React from 'react';
import ServerOption from './components/ServerOption/ServerOption';
import styles from './NewServer.module.scss';
import useServers from 'Hooks/useServers';

function NewServer() {
  const { servers } = useServers();
  const hasServers = !!servers.length;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Add a Server</h1>
        <h3 className={styles.subtitle}>
          Before working on a project, you must first connect to a local or
          remote server.
        </h3>
        <div className={styles.servers}>
          <ServerOption
            title="Connect to a Remote Server"
            subtitle="Remote servers are ready and might contain active projects. You need access privileges to the Server before connecting to it."
            actionLabel="CONNECT"
            to={ROUTE.CONNECT_TO_REMOTE_SERVER}
            Server={<Server direction={DIRECTION.UP} />}
          />
          <ServerOption
            title="Install a Local Server"
            subtitle="You can work locally by installing a KDL Server in your machine. Only one local Server can be installed."
            actionLabel="INSTALL"
            to={ROUTE.CHECK_LOCAL_SERVER_REQUIREMENTS}
            Server={<Server direction={DIRECTION.DOWN} />}
          />
        </div>
      </div>
      {hasServers && (
        <ActionsBar className={styles.actionBar} centerActions>
          <Button label="CANCEL" to={ROUTE.HOME} />
        </ActionsBar>
      )}
    </div>
  );
}

export default NewServer;
