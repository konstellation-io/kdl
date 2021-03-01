import Request from './Request';
import { createServer } from './server';
import { ipcMain } from 'electron';
import { spawn } from 'child_process';

const ENV_VARS = {
  MINIKUBE_PROFILE: 'kdl-local',
  MINIKUBE_MEMORY: '8192', // Mb
  MINIKUBE_KUBERNETES_VERSION: '1.16.10',
  MINIKUBE_CPUS: '4',
  MINIKUBE_DISK_SIZE: '60g',
  MINIKUBE_DRIVER: 'virtualbox',
};

const commands: { [k: string]: string } = {
  minikube: 'command -v minikube',
  kubectl: 'command -v kubectl',
  helm: 'command -v helm',
  docker: 'command -v docker',
  envsubst: 'command -v envsubst',
};

// minikube start -p "$MINIKUBE_PROFILE" \
//   --cpus="$MINIKUBE_CPUS" \
//   --memory="$MINIKUBE_MEMORY" \
//   --kubernetes-version="$MINIKUBE_KUBERNETES_VERSION" \
//   --disk-size="$MINIKUBE_DISK_SIZE" \
//   --driver="$MINIKUBE_DRIVER" \
//   --extra-config=apiserver.authorization-mode=RBAC

//       run minikube addons enable ingress -p "$MINIKUBE_PROFILE"
//       run minikube addons enable registry -p "$MINIKUBE_PROFILE"
//       run minikube addons enable storage-provisioner -p "$MINIKUBE_PROFILE"
//       run minikube addons enable metrics-server -p "$MINIKUBE_PROFILE"

const testCmd = `minikube delete -p kdl-local`;
const startMkCmd = `PATH=$PATH:/usr/bin minikube start -p ${ENV_VARS.MINIKUBE_PROFILE} --cpus=${ENV_VARS.MINIKUBE_CPUS} --memory=${ENV_VARS.MINIKUBE_MEMORY} --kubernetes-version=${ENV_VARS.MINIKUBE_KUBERNETES_VERSION} --disk-size=${ENV_VARS.MINIKUBE_DISK_SIZE} --driver=${ENV_VARS.MINIKUBE_DRIVER} --extra-config=apiserver.authorization-mode=RBAC`;
const mkAddonIngressCmd = `PATH=$PATH:/usr/bin minikube addons enable ingress -p ${ENV_VARS.MINIKUBE_PROFILE}`;
const mkAddonRegistryCmd = `PATH=$PATH:/usr/bin minikube addons enable registry -p ${ENV_VARS.MINIKUBE_PROFILE}`;
const mkAddonSProvisoner = `PATH=$PATH:/usr/bin minikube addons enable storage-provisioner -p ${ENV_VARS.MINIKUBE_PROFILE}`;
const mkAddonMServer = `PATH=$PATH:/usr/bin minikube addons enable metrics-server -p ${ENV_VARS.MINIKUBE_PROFILE}`;

console.log('############################################', startMkCmd);

function executeCmd(cmd: string, request: Request) {
  const cmdArr = cmd.split(' ');
  const [execCmd, ...params] = cmdArr;

  const cmdExecution = spawn(execCmd, params, {
    env: ENV_VARS,
    shell: true,
  });

  cmdExecution.stdout.on('data', (data) => request.onData(data));
  cmdExecution.stderr.on('data', (data) => request.onError(data));

  return cmdExecution;
}

function deployLocalEnv(request: Request) {
  return new Promise((resolve) => {
    const startMk = executeCmd(testCmd, request);

    startMk.on('close', (code) => {
      if (code === 0) {
        executeCmd(mkAddonIngressCmd, request);
        executeCmd(mkAddonRegistryCmd, request);
        executeCmd(mkAddonSProvisoner, request);
        executeCmd(mkAddonMServer, request);

        createServer({
          name: 'Local Server',
          state: 'STOPPED',
          type: 'local',
          warning: true,
          url: 'local-server-url.local-server-domain',
        });
      }

      resolve(request.onClose(code));
    });
  });
}

ipcMain.on('installLocalServer', (event) => {
  const request = new Request(event, 'installLocalServer');

  deployLocalEnv(request)
    .then((success) => {
      console.log('SUCCESS', success);
    })
    .catch((error) => {
      event.sender.send('mainProcessError', error);
    });
});

ipcMain.on('checkRequirement', (event, requirement) => {
  const command = commands[requirement];
  const request = new Request(event, 'checkRequirement', command);

  request
    .runCommand()
    .then((_) => {
      request.reply([requirement, true]);
    })
    .catch((_) => {
      request.reply([requirement, false]);
    });
});
