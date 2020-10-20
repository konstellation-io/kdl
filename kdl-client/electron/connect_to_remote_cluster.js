const electron = require('electron');
const { spawn } = require('child_process');

function connectToRemoteCluster(event, clusterUrl) {
  return new Promise(_ => {
    const cmd = spawn('ls');

    cmd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      event.sender.send('connectToRemoteClusterReply', {
        success: true
      });
    });

    cmd.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      event.sender.send('connectToRemoteClusterReply', {
        success: false,
        errorMsg: String(data),
      });
    });

    cmd.on('close', (code) => {
      const success = code === 0;

      console.log(`child process exited with code ${code}`);
      event.sender.send('connectToRemoteClusterReply', {
        success,
        error: success && `child process exited with code ${code}`
      });
    });
  });
}

function clusterLogin(event, email) {
  return new Promise(_ => {
    const cmd = spawn('ls');

    cmd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      event.sender.send('clusterLoginReply', {
        success: true
      });
    });

    cmd.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      event.sender.send('clusterLoginReply', {
        success: false,
        errorMsg: String(data),
      });
    });

    cmd.on('close', (code) => {
      const success = code === 0;

      console.log(`child process exited with code ${code}`);
      event.sender.send('clusterLoginReply', {
        success,
        // TODO: uncomment this
        // error: success && `child process exited with code ${code}`
      });
    });
  });
}

console.log('Add connectToRemoteCluster listener...');
electron.ipcMain.on('connectToRemoteCluster', (event, clusterUrl) => {
  connectToRemoteCluster(event, clusterUrl);
});

console.log('Add clusterLogin listener...');
electron.ipcMain.on('clusterLogin', (event, email) => {
  clusterLogin(event, email);
});
