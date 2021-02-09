import { RouteServerParams } from 'Constants/routes';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useServers from '../../Hooks/useServers';

function Server() {
  const { serverId } = useParams<RouteServerParams>();
  const { getServer } = useServers();
  const server = getServer(serverId);

  useEffect(() => () => ipcRenderer.send('closeServer'), []);

  useEffect(() => {
    ipcRenderer.send('closeServer');
    console.log(server?.url);
    // FIXME: pass the admin-ui url as arg in the send function
    ipcRenderer.send('loadServer');
  }, [server]);

  return null;
}

export default Server;
