import Request from '../Request';
import { createServer } from '../server';
import { ipcMain } from 'electron';
import {execCommand, spawnCommand} from "./helper";
import {deployLocalCommands} from './commands'
import {deployLocalEnvVars} from "./env_vars";
import * as fs from "fs";

function executeCmd(cmd: string, request: Request): Promise<void> {
  return spawnCommand(
    cmd
    , (data:string) =>{
      request.reply({
        finished: false,
        text: String(data),
      })
    }, (data: string) =>{
      request.reply({
        finished: false,
        text: String(data),
        isError: true,
      })
    },
    deployLocalEnvVars,
  )
}

function createKdlDir() {
  const kdlDir = `${deployLocalEnvVars.HOME}/.kdl`
  if (!fs.existsSync(kdlDir)){
    fs.mkdirSync(kdlDir);
  }
}

async function deployLocalEnv(request: Request): Promise<void> {
  createKdlDir()

  for (let cmd of deployLocalCommands) {
    await executeCmd(cmd, request)
  }

  request.reply({
    success: true,
    finished: true,
    isError: false,
    text: `All commands executed correctly. Done.`,
  })
}

async function getMinikubeIP() {
  const {stdout} = await execCommand("minikube -p kdl-local ip")
  return stdout
}

async function getServerURL() {
  const minikubeIP = await getMinikubeIP()
  return `https://kdlapp.kdl.${minikubeIP}.nip.io`
}

async function saveLocalServerInDB() {
  const serverUrl = await getServerURL()
  createServer({
    name: 'Local Server',
    state: 'STARTED',
    type: 'local',
    warning: false,
    url: serverUrl,
  });
}

export function registerInstallLocalServerEvent() {
  ipcMain.on('installLocalServer', async (event) => {
    const request = new Request(event, 'installLocalServer');

    try {
      await deployLocalEnv(request);
      await saveLocalServerInDB();
    } catch (err) {
      request.notifyError(err);
    }
  });
}
