import { deployLocalEnvVars as env } from './env_vars';

const startMkCmd = `minikube start -p ${env.MINIKUBE_PROFILE} \
 --cpus=${env.MINIKUBE_CPUS} \
 --memory=${env.MINIKUBE_MEMORY} \
 --kubernetes-version=${env.MINIKUBE_KUBERNETES_VERSION} \
 --disk-size=${env.MINIKUBE_DISK_SIZE} \
 --driver=${env.MINIKUBE_DRIVER} \
 --extra-config=apiserver.authorization-mode=RBAC`;

const mkAddonIngressCmd = `minikube addons enable ingress -p ${env.MINIKUBE_PROFILE}`;
const mkAddonRegistryCmd = `minikube addons enable registry -p ${env.MINIKUBE_PROFILE}`;
const mkAddonSProvisioner = `minikube addons enable storage-provisioner -p ${env.MINIKUBE_PROFILE}`;
const mkAddonMServer = `minikube addons enable metrics-server -p ${env.MINIKUBE_PROFILE}`;

export const startMinikubeCommands = [
  startMkCmd,
  mkAddonIngressCmd,
  mkAddonRegistryCmd,
  mkAddonSProvisioner,
  mkAddonMServer,
];

export function deployLocalCommands(minikubeIP: string) {
  const isWin = process.platform === 'win32';

  const k8sCreateNamesapce = `kubectl create ns kdl --dry-run -o yaml | kubectl apply -f -`;

  const createCert = `mkcert --install *.kdl.${minikubeIP}.nip.io`;
  const mvCert = `${isWin ? 'move' : 'mv'} _wildcard.* ${env.CA_CERTS_FOLDER}`;

  const k8sCreateCert = `kubectl -n kdl create secret tls kdl.${minikubeIP}.nip.io-tls-secret \
  --key=${env.CA_CERTS_FOLDER}/_wildcard.kdl.${minikubeIP}.nip.io-key.pem \
  --cert=${env.CA_CERTS_FOLDER}/_wildcard.kdl.${minikubeIP}.nip.io.pem \
  --dry-run -o yaml | kubectl apply -f -`;

  const helmRepoStable = `helm repo add stable https://charts.helm.sh/stable`;
  const helmRepoKDL = `helm repo add kdl https://kdl.konstellation.io`;
  const helmRepoUpdate = `helm repo update`;
  const helmInstallKDL = `helm upgrade \
                          --wait \
                          --version v0.1.0 \
                          --install kdl \
                          --namespace kdl \
                          --set domain=kdl.${minikubeIP}.nip.io \
                          --set science-toolkit.domain=kdl.${minikubeIP}.nip.io \
                          --set science-toolkit.tls.enabled=true \
                          --set science-toolkit.minio.securityContext.runAsUser=0 \
                          --set science-toolkit.gitea.admin.username=kdl \
                          --set science-toolkit.gitea.admin.password=kdl123 \
                          --timeout 60m \
                          kdl/kdl-server`;
  return [
    k8sCreateNamesapce,
    createCert,
    mvCert,
    k8sCreateCert,
    helmRepoStable,
    helmRepoKDL,
    helmRepoUpdate,
    helmInstallKDL,
  ];
}
