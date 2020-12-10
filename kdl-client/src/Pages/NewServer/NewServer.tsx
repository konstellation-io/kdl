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
          Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras
          ullamcorper bibendum bibendum.
        </h3>
        <div className={styles.servers}>
          <ServerOption
            title="Connect to a Remote Server"
            subtitle="Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. "
            actionLabel="CONNECT"
            to={ROUTE.CONNECT_TO_REMOTE_SERVER}
            Server={<Server direction={DIRECTION.UP} />}
          />
          <ServerOption
            title="Install a Local Server"
            subtitle="Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae."
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
