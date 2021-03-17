import { ipcMain } from 'electron';
import Request from '../Request';
import { createServer, Server } from '../server';
import https from 'https';

interface ServerConfig {
  SERVER_URL: string;
  SERVER_NAME: string;
}

function getServerConfiguration(url: string): Promise<ServerConfig> {
  return new Promise((resolve, reject) => {
    const configUrl = new URL(url);
    configUrl.pathname = 'config.json';
    https
      .get(`${configUrl.toString()}`, (res) => {
        if (res.statusCode != 200) {
          reject('Unexpected status code loading the server config');
          return;
        }

        res.on('data', (d) => {
          resolve(JSON.parse(d));
        });
      })
      .on('error', (e) => {
        reject(e);
      });
  });
}

async function createRemoteServer(request: Request, server: Server) {
  const configJson = await getServerConfiguration(server.url);
  const serverName = configJson.SERVER_NAME;

  if (!serverName) {
    console.error(
      `Server located at ${server.url} did not provide a correct config.json file`
    );
    throw new Error(
      `Could not get Server configuration. Are you sure this is a KDL Server?`
    );
  }

  const serverId = createServer({
    ...server,
    name: serverName,
    state: 'SIGNED_OUT',
    type: 'remote',
  });

  request.reply({ success: true, serverId });
}

export function registerConnectToRemoteServer() {
  ipcMain.on('connectToRemoteServer', async (event, server) => {
    const request = new Request(event, 'connectToRemoteServer');
    try {
      await createRemoteServer(request, server);
    } catch (e) {
      request.reply({ success: false, error: e.toString() });
    }
  });
}
