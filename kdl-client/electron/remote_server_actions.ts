import { createServer, updateServer } from './server';

import Request from './Request';
import { ipcMain } from 'electron';

// TODO: update commands
const command = {
  connect: 'ls',
  signId: 'ls',
  signOut: 'ls',
};

ipcMain.on('connectToRemoteServer', (event, server) => {
  const request = new Request(event, 'connectToRemoteServer', command.connect);

  request.runCommand()
    .then(success => {
      // TODO: Get server name from server
      const serverName = 'Remote server';

      const serverId = createServer({
        ...server,
        name: serverName,
        state: 'SIGNED_OUT',
        type: 'remote'
      });

      request.reply({ success, serverId });
    })
    .catch((_: unknown) => {
      event.sender.send('mainProcessError', 'Could not connect to server');
    });
});

ipcMain.on('serverLogout', (event, serverId) => {
  const request = new Request(event, 'serverLogout', command.signOut);

  request.runCommand()
    .then(success => {
      success && updateServer(serverId, { state: 'SIGNED_OUT' })
      request.reply({ success });
    })
    .catch((_: unknown) => {
      event.sender.send('mainProcessError', 'Could not sign out');
    });
});
