import {ipcMain} from "electron";
import Request from "../Request";
import {execCommand} from "./helper";

const commands: { [k: string]: string } = {
  minikube: 'command -v minikube',
  kubectl: 'command -v kubectl',
  helm: 'command -v helm',
  docker: 'command -v docker',
  envsubst: 'command -v envsubst',
  mkcert: 'command -v mkcert',
};

export function registerCheckRequirementEvent() {
  ipcMain.on('checkRequirement', async (event, requirement) => {
    const command = commands[requirement];
    const request = new Request(event, 'checkRequirement');

    try {
      await execCommand(command)
      request.reply([requirement, true]);
    } catch(err) {
      request.reply([requirement, false]);
    }
  });
}
