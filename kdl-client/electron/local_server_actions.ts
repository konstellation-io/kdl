import Request from './Request';
import { ipcMain } from 'electron';
import { updateServer } from './server';

// TODO: update commands
const command = {
  start: 'ls',
  stop: 'lsasdsdada',
};

ipcMain.on('startLocalServer', (event, serverId: string) => {
  const request = new Request(event, '', command.start);
  updateServer(serverId, { state: 'STARTING' });

  request.runCommand()
    .then(_ => {
      // TODO: Remove this timeout
      setTimeout(() => {
        updateServer(serverId, {
          state: 'STARTED',
          warning: false
        });
      }, 5000);
    })
    .catch((_: unknown) => {
      updateServer(serverId, {
        state: 'STOPPED',
        warning: true
      });
      event.sender.send('mainProcessError', 'Cannot start server');
    });
});

ipcMain.on('stopLocalServer', (event, serverId: string) => {
  const request = new Request(event, '', command.stop);
  updateServer(serverId, { state: 'STOPPING' });

  request.runCommand()
    .then((_: unknown) => {
      updateServer(serverId, {
        state: 'STOPPED',
        warning: false
      });
    })
    .catch(_ => {
      // TODO: Remove this timeout
      setTimeout(() => {
        updateServer(serverId, {
          state: 'STOPPED',
          warning: true
        });

        event.sender.send('mainProcessError', 'Cannot stop server');
      }, 5000);
    });
});
