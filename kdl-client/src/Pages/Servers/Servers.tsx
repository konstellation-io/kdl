import { LocalServer, RemoteServer } from './components/Server/Server';
import React, { useEffect, useState } from 'react';
import useServers, { Server, ServerType } from 'Hooks/useServers';

import ROUTE from 'Constants/routes';
import ServersBar from './components/ServersBar/ServersBar';
import ServersSection from './components/ServersSection/ServersSection';
import styles from './Servers.module.scss';
import { useForm } from 'react-hook-form';

type FormData = {
  serverSearch: string;
};

function Servers() {
  const { servers } = useServers();
  const [filteredServers, setFilteredServers] = useState<Server[]>(servers);

  const { setValue, unregister, register, watch } = useForm<FormData>({
    defaultValues: { serverSearch: '' },
  });

  useEffect(() => {
    register('serverSearch');
    return () => unregister('serverSearch');
  }, [register, unregister, setValue]);

  const serverSearch = watch('serverSearch');
  useEffect(() => {
    setFilteredServers(
      servers.filter(
        (server) =>
          server.type === ServerType.LOCAL || server.url?.includes(serverSearch)
      )
    );
  }, [servers, serverSearch]);

  const localServers: Server[] = servers.filter(
    (server) => server.type === ServerType.LOCAL
  );
  const filteredRemoteServers = filteredServers.filter(
    (server) => server.type === ServerType.REMOTE
  );
  const nServers = localServers.length + filteredRemoteServers.length;

  return (
    <div className={styles.container}>
      <ServersBar setValue={setValue} nServers={nServers} />
      <div className={styles.content}>
        <ServersSection
          title="LOCAL SERVER"
          subtitle="ONLY ONE LOCAL SERVER IS AVAILABLE IN KONSTELLATION"
          servers={localServers}
          ServerComponent={LocalServer}
          addServerRoute={
            localServers.length === 0
              ? ROUTE.CHECK_LOCAL_SERVER_REQUIREMENTS
              : undefined
          }
        />
        <ServersSection
          title="REMOTE SERVERS"
          subtitle="YOU MAY HAVE AS MANY SERVERS AS YOU WANT"
          servers={filteredRemoteServers}
          ServerComponent={RemoteServer}
          addServerRoute={ROUTE.CONNECT_TO_REMOTE_SERVER}
        />
      </div>
    </div>
  );
}

export default Servers;
