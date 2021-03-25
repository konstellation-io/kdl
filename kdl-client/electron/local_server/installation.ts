import Request from '../Request';
import { createServer } from '../server';
import { ipcMain } from 'electron';
import { execCommand, spawnCommand } from './helper';
import { deployLocalCommands, startMinikubeCommands } from './commands';
import { deployLocalEnvVars } from './env_vars';
import * as fs from 'fs';

function executeCmd(cmd: string, request: Request): Promise<void> {
  return spawnCommand(
    cmd,
    (data: Buffer) => {
      request.reply({
        finished: false,
        text: String(data),
      });
    },
    (data: Buffer) => {
      request.reply({
        finished: false,
        text: String(data),
        isError: true,
      });
    },
    deployLocalEnvVars
  );
}

function createKdlDir() {
  const kdlDir = `${deployLocalEnvVars.HOME}/.kdl`;
  if (!fs.existsSync(kdlDir)) {
    fs.mkdirSync(kdlDir);
  }
}

async function getMinikubeIP() {
  const { stdout } = await execCommand('minikube -p kdl-local ip');
  return stdout.replace(/\r?\n|\r/g, '');
}

async function deployLocalEnv(request: Request): Promise<string> {
  createKdlDir();

  // First of all the minikube must start
  for (let cmd of startMinikubeCommands) {
    await executeCmd(cmd, request);
  }

  // The installation requires the minikube IP to continue with the installation
  const minikubeIP = await getMinikubeIP();
  const deployCommands = deployLocalCommands(minikubeIP);

  for (let cmd of deployCommands) {
    await executeCmd(cmd, request);
  }

  request.reply({
    finished: true,
    isError: false,
    text: `All commands executed correctly. Done.`,
  });

  return minikubeIP;
}

async function getServerURL(minikubeIP: string) {
  return `https://kdlapp.kdl.${minikubeIP}.nip.io`;
}

async function saveLocalServerInDB(minikubeIP: string) {
  const serverUrl = await getServerURL(minikubeIP);
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
      const minikubeIP = await deployLocalEnv(request);
      await saveLocalServerInDB(minikubeIP);
    } catch (err) {
      request.reply({
        finished: true,
        isError: true,
        text: err,
      });
    }
  });
}
