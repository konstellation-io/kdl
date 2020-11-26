import { createServer, updateServerState } from './server';

import Request from './Request';
import { ipcMain } from 'electron';

ipcMain.on('connectToRemoteServer', (event, server) => {
  const request = new Request(event, 'connectToRemoteServer', `echo ${server.url}`);
  request.runCommand().then(success => {
    // TODO: Get server name from server
    const serverName = 'Remote server';

    const serverId = createServer({
      ...server,
      name: serverName,
      state: 'SIGNED_OUT',
      type: 'remote'
    });

    request.reply({ success, serverId });
  });
});

ipcMain.on('serverLogin', (event, { serverId, email }) => {
  const request = new Request(event, 'serverLogin', `echo ${email}`);
  request.runCommand().then(success => {
    success && updateServerState(serverId, 'SIGNED_IN');
    request.reply({ success });
  });
});

ipcMain.on('serverLogout', (event, serverId) => {
  const request = new Request(event, 'serverLogout', `echo ${serverId}`);
  request.runCommand().then(success => {
    success && updateServerState(serverId, 'SIGNED_OUT')
    request.reply({ success });
  });
});
