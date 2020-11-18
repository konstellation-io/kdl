import { createCluster, updateClusterState } from './cluster';

import Request from './Request';
import { ipcMain } from 'electron';

ipcMain.on('connectToRemoteCluster', (event, cluster) => {
  const request = new Request(event, 'connectToRemoteCluster', `echo ${cluster.id}`);
  request.runCommand().then(success => {
    const clusterId = createCluster({
      ...cluster,
      state: 'SIGNED_OUT',
      type: 'remote'
    });

    request.reply({ success, clusterId });
  });
});

ipcMain.on('clusterLogin', (event, { clusterId, email }) => {
  const request = new Request(event, 'clusterLogin', `echo ${email}`);
  request.runCommand().then(success => {
    success && updateClusterState(clusterId, 'SIGNED_IN');
    request.reply({ success });
  });
});

ipcMain.on('clusterLogout', (event, clusterId) => {
  const request = new Request(event, 'clusterLogout', `echo ${clusterId}`);
  request.runCommand().then(success => {
    success && updateClusterState(clusterId, 'SIGNED_OUT')
    request.reply({ success });
  });
});
