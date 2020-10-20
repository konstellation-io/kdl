const electron = require('electron');
const settings = require('./settings.json');
const { spawn } = require('child_process');

function onData(event, data) {
  console.log(`stdout: ${data}`);
  event.sender.send('installLocalClusterReply', {
    finished: false,
    text: String(data),
  });
}

function onError(event, data) {
  console.error(`stderr: ${data}`);
  event.sender.send('installLocalClusterReply', {
    finished: false,
    text: String(data),
    isError: true,
  });
}

function onClose(code, event) {
  const success = code === 0;

  console.log(`child process exited with code ${code}`);
  event.sender.send('installLocalClusterReply', {
    finished: true,
    isError: !success,
    text: `child process exited with code ${code}`,
  });

  return success;
}

function createNameSpace(event) {
  return new Promise(resolve => {
    const cmd = spawn('kubectl', ['create', 'ns', 'kst-local']);

    cmd.stdout.on('data', data => onData(event, data));
    cmd.stderr.on('data', data => onError(event, data));
    cmd.on('close', code => resolve(onClose(code, event)));
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

    cmd.stdout.on('data', data => onData(event, data));
    cmd.stderr.on('data', data => onError(event, data));
    cmd.on('close', (code) => resolve(onClose(code, event)));
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
