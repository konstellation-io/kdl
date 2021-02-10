import { Server, createServer } from './server';

import Request from './Request';
import fetch from 'node-fetch';
import { ipcMain } from 'electron';

function getServerConfiguration(url: string) {
  return fetch(`${url}/config.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Unexpected status code: ${response.status} getting configuration file`
          );
        }
        return response.json();
    });
}

function createRemoteServer(request: Request, server: Server) {
  getServerConfiguration(server.url)
    .then((configJson) => {
      const serverName = configJson.SERVER_NAME;

      // TODO: Add KDL check to make sure we are connecting to a KDL server.
      if (!serverName) {
        console.error(
          `Server located at ${server.url} did not provide a correct config.json file`
        );
        throw new Error(
          `Could not get Server configuration. Are you sure this is a KDL Server?`
        );
      }

      const serverId = createServer({
        ...server,
        name: serverName,
        state: 'SIGNED_OUT',
        type: 'remote'
      });
      request.reply({ success: true, serverId });
    })
    .catch((e) => {
      request.event.sender.send('mainProcessError', 'Cannot connect to Remote Server');
      request.reply({ success: false, error: e.toString() });
    });
}

ipcMain.on('connectToRemoteServer', (event, server) => {
  const request = new Request(event, 'connectToRemoteServer');
  createRemoteServer(request, server);
});
