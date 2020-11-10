const electron = require('electron');
const settings = require('./settings.json');
const { createCluster } = require('./cluster');
const { spawn } = require('child_process');
const Request = require('./Request');

const commands = {
  k8s: "kubectl get nodes -o jsonpath='{.items[*].status.conditions[*].type}'",
  minikube: 'minikube status',
  helm: 'helm ls'
};

function createNamespace(request) {
  return new Promise(resolve => {
    const cmd = spawn('kubectl', ['create', 'ns', 'kst-local']);

    // TODO: Remove this and include after successful installation
    createCluster({
      name: 'Local Cluster',
      state: 'STOPPED',
      type: 'local'
    });

    cmd.stdout.on('data', data => request.onData(data));
    cmd.stderr.on('data', data => request.onError(data));
    cmd.on('close', code => resolve(request.onClose(code)));
  });
}

function installComponents(request) {
  return new Promise(resolve => {
    const cmd = spawn('helm', [
      'upgrade',
      '--install',
      'kdl',
      '--namespace',
      'kdl',
      '--wait',
      settings.chartUrl,
    ]);

    cmd.stdout.on('data', data => request.onData(data));
    cmd.stderr.on('data', data => request.onError(data));
    cmd.on('close', code => {
      const success = request.onClose(code);

      if (success) {
        createCluster({
          name: 'Local Cluster',
          state: 'STOPPED',
          // TODO: get and build local cluster url
          url: 'local-cluster-url.local-cluster-domain',
          type: 'local'
        });
      }

      resolve(success);
    });

  });
}

electron.ipcMain.on('installLocalCluster', event => {
  const request = new Request(event, 'installLocalCluster');
  createNamespace(request).then(success => {
    if (success) {
      return installComponents(request);
    }
  });
});

electron.ipcMain.on('checkRequirement', (event, requirement) => {
  const command = commands[requirement];
  const request = new Request(event, 'checkRequirement', command);

  request.runCommand()
    .then(result => {
      request.reply([requirement, result]);
    });
});
