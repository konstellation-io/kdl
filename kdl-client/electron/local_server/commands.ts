const startMkCmd = `minikube start -p $MINIKUBE_PROFILE --cpus=$MINIKUBE_CPUS --memory=$MINIKUBE_MEMORY --kubernetes-version=$MINIKUBE_KUBERNETES_VERSION --disk-size=$MINIKUBE_DISK_SIZE --driver=$MINIKUBE_DRIVER --extra-config=apiserver.authorization-mode=RBAC`;
const mkAddonIngressCmd = `minikube addons enable ingress -p $MINIKUBE_PROFILE`;
const mkAddonRegistryCmd = `minikube addons enable registry -p $MINIKUBE_PROFILE`;
const mkAddonSProvisoner = `minikube addons enable storage-provisioner -p $MINIKUBE_PROFILE`;
const mkAddonMServer = `minikube addons enable metrics-server -p $MINIKUBE_PROFILE`;
const k8sCreateNamesapce = `kubectl create ns kdl --dry-run -o yaml | kubectl apply -f -`;

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

export const deployLocalCommands = [
  startMkCmd,
  mkAddonIngressCmd,
  mkAddonRegistryCmd,
  mkAddonSProvisoner,
  mkAddonMServer,
  k8sCreateNamesapce,
  createCert,
  k8sCreateCert,
  helmRepoStable,
  helmRepoKDL,
  helmRepoUpdate,
  helmInstallKDL
];
