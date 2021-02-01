import ROUTE, { buildRoute } from 'Constants/routes';
import { useEffect, useState } from 'react';

import { Action } from 'Pages/Servers/components/Server/Server';
import IconStart from '@material-ui/icons/PlayArrow';
import IconStop from '@material-ui/icons/Stop';
import { LocalServerStates } from 'Pages/Servers/components/Server/LocalServer';
import { RemoteServerStates } from 'Pages/Servers/components/Server/RemoteServer';

export enum ServerType {
  LOCAL = 'local',
  REMOTE = 'remote',
}
export type Server = {
  id: string;
  name: string;
  type: ServerType;
  state: LocalServerStates | RemoteServerStates;
  url?: string;
};

export type AddServer = {
  name: string;
  type: ServerType;
  url?: string;
};

function useServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   function onStoreUpdate(_: unknown, { key, value }: StoreUpdate) {
  //     if (key === StoreKey.SERVERS) {
  //       setServers(value);
  //     }
  //   }
  //
  //   ipcRenderer.send("subscribeToValue", StoreKey.SERVERS);
  //   ipcRenderer.on("subscribeToValueReply", onStoreUpdate);
  //
  //   async function fetchData() {
  //     const storeServers = await ipcRenderer.invoke(
  //       "getStoreValue",
  //       StoreKey.SERVERS
  //     );
  //     setServers(storeServers);
  //     setLoading(false);
  //   }
  //   fetchData();
  //
  //   return () => {
  //     ipcRenderer.removeListener("subscribeToValueReply", onStoreUpdate);
  //   };
  // }, []);

  function getServer(id: string): Server | undefined {
    return servers.find((server) => server.id === id);
  }

  function getServerActions(
    state: LocalServerStates | RemoteServerStates,
    id: string
  ) {
    let actions: Action[] = [];

    switch (state) {
      case RemoteServerStates.SIGNED_OUT:
        actions = [
          {
            label: 'SIGN IN',
            Icon: IconStart,
            to: buildRoute.server(ROUTE.SERVER_LOGIN, id),
          },
        ];
        break;
      case RemoteServerStates.SIGNED_IN:
        actions = [
          {
            label: 'SIGN OUT',
            Icon: IconStop,
            onClick: () => {
              console.log('que hacer');
              // ipcRenderer.send("serverLogout", id)
            },
          },
        ];
        break;
      case LocalServerStates.STARTED:
        actions = [
          {
            label: 'STOP',
            Icon: IconStop,
            onClick: () => {
              console.log('que hacer');
              // ipcRenderer.send("stopLocalServer", id)
            },
          },
        ];
        break;
      case LocalServerStates.STOPPED:
        actions = [
          {
            label: 'START',
            Icon: IconStart,
            onClick: () => {
              console.log('que hacer');
              // ipcRenderer.send("startLocalServer", id);
            },
          },
        ];
        break;
      default:
        break;
    }

    return actions;
  }

  return {
    servers,
    loading,
    getServer,
    getServerActions,
  };
}

export default useServers;
