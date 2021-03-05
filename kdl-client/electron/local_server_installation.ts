import Request from './Request';
import { createServer } from './server';
import { ipcMain, app } from 'electron';
import { spawn } from 'child_process';
import { PersonAddOutlined } from '@material-ui/icons';

console.log('----------------------------- APP: ', process.env.PATH)
const ENV_VARS = {
  MINIKUBE_PROFILE: 'kdl-local',
  MINIKUBE_MEMORY: '8192', // Mb
  MINIKUBE_KUBERNETES_VERSION: '1.16.10',
  MINIKUBE_CPUS: '4',
  MINIKUBE_DISK_SIZE: '60g',
  MINIKUBE_DRIVER: 'virtualbox',
  HOME: `${app.getPath('home')}`,
  PATH: process.env.PATH,
  CA_CERTS_FOLDER: `${app.getPath('home')}/.kdl`,
  TRUST_STORES: 'nss',
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

const testCmd = `echo "Path of exec commands: $(pwd)"`;
const startMkCmd = `minikube start -p ${ENV_VARS.MINIKUBE_PROFILE} --cpus=${ENV_VARS.MINIKUBE_CPUS} --memory=${ENV_VARS.MINIKUBE_MEMORY} --kubernetes-version=${ENV_VARS.MINIKUBE_KUBERNETES_VERSION} --disk-size=${ENV_VARS.MINIKUBE_DISK_SIZE} --driver=${ENV_VARS.MINIKUBE_DRIVER} --extra-config=apiserver.authorization-mode=RBAC`;
const mkAddonIngressCmd = `minikube addons enable ingress -p ${ENV_VARS.MINIKUBE_PROFILE}`;
const mkAddonRegistryCmd = `minikube addons enable registry -p ${ENV_VARS.MINIKUBE_PROFILE}`;
const mkAddonSProvisoner = `minikube addons enable storage-provisioner -p ${ENV_VARS.MINIKUBE_PROFILE}`;
const mkAddonMServer = `minikube addons enable metrics-server -p ${ENV_VARS.MINIKUBE_PROFILE}`;
const k8sCreateNamesapce = `kubectl create ns kdl --dry-run -o yaml | kubectl apply -f -`;

const createKDLFolder = `mkdir -p $HOME/.kdl`;
const createCert = `mkcert --install  *.kdl.$(minikube -p $MINIKUBE_PROFILE ip).nip.io && mv _wildcard.* $CA_CERTS_FOLDER`;
const k8sCreateCert = `kubectl -n kdl create secret tls kdl.$(minikube -p $MINIKUBE_PROFILE ip).nip.io-tls-secret --key=$CA_CERTS_FOLDER/_wildcard.kdl.$(minikube -p $MINIKUBE_PROFILE ip).nip.io-key.pem --cert=$CA_CERTS_FOLDER/_wildcard.kdl.$(minikube -p $MINIKUBE_PROFILE ip).nip.io.pem --dry-run -o yaml | kubectl apply -f -`;

const helmRepoStable = `helm repo add stable https://charts.helm.sh/stable`;
const helmRepoKDL = `helm repo add kdl https://kdl.konstellation.io`;
const helmRepoUpdate = `helm repo update`;
const helmInstallKDL = `helm upgrade \
                          --wait \
                          --version v0.1.0 \
                          --install kdl \
                          --namespace kdl \
                          --set domain=kdl.$(minikube -p $MINIKUBE_PROFILE ip).nip.io \
                          --set science-toolkit.domain=kdl.$(minikube -p $MINIKUBE_PROFILE ip).nip.io \
                          --set science-toolkit.tls.enabled=true \
                          --set science-toolkit.minio.securityContext.runAsUser=0 \
                          --set science-toolkit.gitea.admin.username=kdl \
                          --set science-toolkit.gitea.admin.password=kdl123 \
                          --timeout 60m \
                          kdl/kdl-server`;

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

const commandsList = [
  startMkCmd,
  mkAddonIngressCmd,
  mkAddonRegistryCmd,
  mkAddonSProvisoner,
  mkAddonMServer,
  k8sCreateNamesapce,
  createKDLFolder,
  createCert,
  k8sCreateCert,
  helmRepoStable,
  helmRepoKDL,
  helmRepoUpdate,
  helmInstallKDL];

function executeCommands(pendingsCommands: string[], request: Request) {
  if (pendingsCommands.length === 0) return;
  const act = pendingsCommands.shift()
  const commandExec = executeCmd(act || "", request);

  commandExec.on('close', (code) => {
    if (code === 0) {
      executeCommands(pendingsCommands, request)
    }
  });
}

function deployLocalEnv(request: Request) {
  return new Promise((resolve) => {
    executeCommands(commandsList, request)

    // const startMk = executeCmd(startMkCmd, request);

    // startMk.on('close', (code) => {
    //   if (code === 0) {
    //     executeCmd(mkAddonIngressCmd, request);
    //     executeCmd(mkAddonRegistryCmd, request);
    //     executeCmd(mkAddonSProvisoner, request);
    //     executeCmd(mkAddonMServer, request);
    //     executeCmd(k8sCreateNamesapce, request);
    //     executeCmd(helmRepoStable, request);
    //     executeCmd(helmRepoKDL, request);
    //     executeCmd(helmRepoUpdate, request);
    //     executeCmd(helmInstallKDL, request);

    //     createServer({
    //       name: 'Local Server',
    //       state: 'STOPPED',
    //       type: 'local',
    //       warning: true,
    //       url: 'local-server-url.local-server-domain',
    //     });
    //   }

    //   resolve(request.onClose(code));
    // });
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
