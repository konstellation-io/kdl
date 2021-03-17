import { Server, createServer } from './server';

import Request from './Request';
import { ipcMain } from 'electron';
import fs from 'fs';
import https from 'https';

interface ServerConfig {
  SERVER_URL: string;
  SERVER_NAME: string;
}

// Depending on the SO this folder will be different:
//  * OS X - '/Users/user/Library/Preferences'
//  * Windows 8 - 'C:\Users\user\AppData\Roaming'
//  * Windows XP - 'C:\Documents and Settings\user\Application Data'
//  * Linux - '/home/user/.local/share'
const appDataFolder =
  process.env.APPDATA ||
  (process.platform == 'darwin'
    ? process.env.HOME + '/Library/Application Support'
    : process.env.HOME + '/.local/share');
const localCAPath = `${appDataFolder}/mkcert/rootCA.pem`;

// loadLocalCA loads our custom CA that is created by mkcert in the local deployment process.
// This is necessary only if we want to add a local deployed kdl-server.
// Move this to local installations. This is temp because we are adding local kdl-servers using the add remote servers process.
function loadLocalCA(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Loading local CA from "${localCAPath}"...`);

    fs.stat(localCAPath, (err) => {
      if (err) {
        console.log('No local CA found');
        resolve();
        return;
      }

      fs.readFile(localCAPath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        https.globalAgent.options.ca = [data];

        console.log('Local CA loaded');
        resolve();
      });
    });
  });
}

function getServerConfiguration(url: string): Promise<ServerConfig> {
  return loadLocalCA().then(() => {
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
  });
}

function createRemoteServer(request: Request, server: Server) {
  getServerConfiguration(server.url)
    .then((configJson) => {
      const serverName = configJson.SERVER_NAME;

      // TODO: Add KDL check to make sure we are connecting to a KDL server.
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
    })
    .catch((e) => {
      request.event.sender.send(
        'mainProcessError',
        'Cannot connect to Remote Server'
      );
      request.reply({ success: false, error: e.toString() });
    });
}

ipcMain.on('connectToRemoteServer', (event, server) => {
  const request = new Request(event, 'connectToRemoteServer');
  createRemoteServer(request, server);
});
