const electron = require('electron');
const { updateClusterState } = require('./cluster');

// TODO: replace this with real actions
function doAction() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
}

electron.ipcMain.on('startLocalCluster', (_, clusterId) => {
  updateClusterState(clusterId, 'STARTING');
  doAction().then(() => {
    updateClusterState(clusterId, 'STARTED');
  });
});

electron.ipcMain.on('stopLocalCluster', (_, clusterId) => {
  updateClusterState(clusterId, 'STOPPING');
  doAction().then(() => {
    updateClusterState(clusterId, 'STOPPED');
  });
});
