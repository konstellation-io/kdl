import { ipcMain } from 'electron';
import { updateServerState } from './server';

// TODO: replace this with real actions
function doAction() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
}

ipcMain.on('startLocalServer', (_: unknown, serverId: string) => {
  updateServerState(serverId, 'STARTING');
  doAction().then(() => {
    updateServerState(serverId, 'STARTED');
  });
});

ipcMain.on('stopLocalServer', (_: unknown, serverId: string) => {
  updateServerState(serverId, 'STOPPING');
  doAction().then(() => {
    updateServerState(serverId, 'STOPPED');
  });
});
