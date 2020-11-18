import { ipcMain } from 'electron';
import { updateClusterState } from './cluster';

// TODO: replace this with real actions
function doAction() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
}

ipcMain.on('startLocalCluster', (_: unknown, clusterId: string) => {
  updateClusterState(clusterId, 'STARTING');
  doAction().then(() => {
    updateClusterState(clusterId, 'STARTED');
  });
});

ipcMain.on('stopLocalCluster', (_: unknown, clusterId: string) => {
  updateClusterState(clusterId, 'STOPPING');
  doAction().then(() => {
    updateClusterState(clusterId, 'STOPPED');
  });
});
