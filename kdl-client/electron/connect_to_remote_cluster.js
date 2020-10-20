const electron = require('electron');
const { spawn } = require('child_process');

function connectToRemoteCluster(event, email) {
  return new Promise(_ => {
    const cmd = spawn('ls');

    cmd.stdout.on('data', __ => {
      event.sender.send('connectToRemoteClusterReply', {
        success: true
      });
    });

    cmd.stderr.on('data', data => {
      event.sender.send('connectToRemoteClusterReply', {
        success: false,
        error: String(data),
      });
    });

    cmd.on('close', __ => {
      // const success = code === 0;

      event.sender.send('connectToRemoteClusterReply', {
        // FIXME: set this to 'success'
        success: true,
        // FIXME: set this to uncomment next line
        // error: success && `child process exited with code ${code}`
      });
    });
  });
}

function clusterLogin(event, email) {
  return new Promise(_ => {
    const cmd = spawn('cd .');

    cmd.stdout.on('data', __ => {
      event.sender.send('clusterLoginReply', {
        success: true
      });
    });

    cmd.stderr.on('data', data => {
      event.sender.send('clusterLoginReply', {
        success: false,
        errorMsg: String(data),
      });
    });

    cmd.on('close', (code) => {
      const ok = code === 0;

      console.log(`child process exited with code ${code}`);
      event.sender.send('clusterLoginReply', {
        success: ok,
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
