import Request from './Request';
import { createCluster } from './cluster';
import { ipcMain } from 'electron';
import settings from './settings.json';
import { spawn } from 'child_process';

const commands: { [k: string]: string} = {
  k8s: "kubectl get nodes -o jsonpath='{.items[*].status.conditions[*].type}'",
  minikube: 'minikube status',
  helm: 'helm ls'
};

function createNamespace(request: Request) {
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

function installComponents(request: Request) {
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

ipcMain.on('installLocalCluster', event => {
  const request = new Request(event, 'installLocalCluster');
  createNamespace(request).then(success => {
    if (success) {
      return installComponents(request);
    }
  });
});

ipcMain.on('checkRequirement', (event, requirement) => {
  const command = commands[requirement];
  const request = new Request(event, 'checkRequirement', command);

  request.runCommand()
    .then(_ => {
      // TODO: retrieve real response state. Remember promise return this state.
      request.reply([requirement, true]);
    });
});
