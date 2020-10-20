const electron = require('electron');
const settings = require('./settings.json');
const { spawn } = require('child_process');

function createNameSpace(event) {
  return new Promise(resolve => {
    const cmd = spawn('kubectl', ['create', 'ns', 'kst-local']);

    cmd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      event.sender.send('installLocalClusterReply', {
        finished: false,
        text: String(data),
      });
    });

    cmd.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      event.sender.send('installLocalClusterReply', {
        finished: false,
        text: String(data),
        isError: true,
      });
    });

    cmd.on('close', (code) => {
      const success = code === 0;

      console.log(`child process exited with code ${code}`);
      event.sender.send('installLocalClusterReply', {
        finished: !success,
        isError: !success,
        text: `child process exited with code ${code}`,
      });

      resolve(success);
    });
  });
}

function installComponents(event) {
  return new Promise(resolve => {
    const cmd = spawn('helm', [
      'upgrade',
      '--install',
      'konstellation-local',
      '--namespace',
      'kdl-local',
      '--wait',
      settings.chartUrl,
    ]);

    cmd.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      event.sender.send('installLocalClusterReply', {
        finished: false,
        text: String(data),
      });
    });

    cmd.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      event.sender.send('installLocalClusterReply', {
        finished: false,
        text: String(data),
        isError: true,
      });
    });

    cmd.on('close', (code) => {
      const success = code === 0;

      console.log(`child process exited with code ${code}`);
      event.sender.send('installLocalClusterReply', {
        finished: true,
        isError: !success,
        text: `child process exited with code ${code}`,
      });

      resolve(success);
    });
  });
}

console.log('Add installLocalCluster listener...');
electron.ipcMain.on('installLocalCluster', event => {
  createNameSpace(event).then(sucess => {
    if (sucess) {
      return installComponents(event);
    }
  });
});
