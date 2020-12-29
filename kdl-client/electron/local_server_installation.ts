import Request from './Request';
import { createServer } from './server';
import { ipcMain } from 'electron';
import settings from './settings.json';
import { spawn } from 'child_process';

const commands: { [k: string]: string } = {
  k8s: "kubectl get nodes -o jsonpath='{.items[*].status.conditions[*].type}'",
  minikube: 'minikube status',
  helm: 'helm ls'
};

function createNamespace(request: Request) {
  return new Promise(resolve => {
    const cmd = spawn('kubectl', ['create', 'ns', 'kst-local']);

    // TODO: Remove this and include after successful installation
    createServer({
      name: 'Local Server',
      state: 'STOPPED',
      type: 'local',
      warning: true
    });

    cmd.stdout.on('data', data => request.onData(data));
    cmd.stderr.on('data', data => request.onError(data));
    cmd.on('close', code => resolve(request.onClose(code)));
  });
}

function installComponents(request: Request) {
  return new Promise((resolve, reject) => {
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
        createServer({
          name: 'Local Server',
          state: 'STOPPED',
          // TODO: get and build local server url
          url: 'local-server-url.local-server-domain',
          type: 'local'
        });

        resolve(success);
      } else {
        reject('Could not finish installation');
      }
    });
  });
}

ipcMain.on('installLocalServer', event => {
  const request = new Request(event, 'installLocalServer');

  createNamespace(request)
    .then(success => {
      if (success) {
        return installComponents(request);
      }
    })
    .catch(error => {
      event.sender.send('mainProcessError', error);
    });
});

ipcMain.on('checkRequirement', (event, requirement) => {
  const command = commands[requirement];
  const request = new Request(event, 'checkRequirement', command);

  request.runCommand()
    .then(_ => {
      request.reply([requirement, true]);
    })
    .catch(_ => {
      // TODO: Remove next line and replace with l85
      request.reply([requirement, true]);
      // request.reply([requirement, false]);
    });
});
