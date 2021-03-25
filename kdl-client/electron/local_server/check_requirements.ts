import { ipcMain } from 'electron';
import Request from '../Request';
import { execCommand } from './helper';

const commands: { [k: string]: string } = {
  minikube: 'minikube version',
  kubectl: 'kubectl version --client',
  helm: 'helm version',
  docker: 'docker version',
  mkcert: 'mkcert --version',
};

export function registerCheckRequirementEvent() {
  ipcMain.on('checkRequirement', async (event, requirement) => {
    const command = commands[requirement];
    const request = new Request(event, 'checkRequirement');

    try {
      await execCommand(command);
      request.reply([requirement, true]);
    } catch (err) {
      request.reply([requirement, false]);
    }
  });
}
