import { app } from 'electron';

const homePath = app.getPath('home');

export const deployLocalEnvVars = {
  MINIKUBE_PROFILE: 'kdl-local',
  MINIKUBE_MEMORY: '8192', // Mb
  MINIKUBE_KUBERNETES_VERSION: '1.16.10',
  MINIKUBE_CPUS: '4',
  MINIKUBE_DISK_SIZE: '60g',
  MINIKUBE_DRIVER: 'virtualbox',
  HOME: homePath,
  PATH: process.env.PATH,
  CA_CERTS_FOLDER: `${homePath}/.kdl`,
  TRUST_STORES: 'nss',
};
