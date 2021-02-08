import { useParams } from 'react-router-dom';
import { RouteServerParams } from 'Constants/routes';
import useServers from '../../Hooks/useServers';
import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';

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
  }, [serverId]);

  return null;
}

export default Server;
