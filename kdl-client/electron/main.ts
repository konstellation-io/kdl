// Add IPC listeners
import './store';
import './local_cluster_actions';
import './local_cluster_installation';
import './remote_cluster_actions';

import { BrowserWindow, app, ipcMain } from 'electron';

import { autoUpdater } from 'electron-updater';
import isDev from 'electron-is-dev';
import { join } from 'path';

interface WindowSize {
  width: number,
  height: number,
}

const SPLASH_SCREEN_MIN_TIME = 2000;
const SPLASH_SCREEN_SIZE: WindowSize = {
  width: 600,
  height: 400,
};
const WINDOW_SIZE: WindowSize = {
  width: 1400,
  height: 900,
};

let mainWindow: BrowserWindow | null = null;
let splashScreen: BrowserWindow | null = null;
const iconPath = isDev
  ? join(__dirname, '../../public/icons/64x64.png')
  : join(__dirname, '../icons/64x64.png');

function showSplashScreen() {
  splashScreen = new BrowserWindow({
    ...SPLASH_SCREEN_SIZE,
    frame: false,
    backgroundColor: '#060606',
    icon: iconPath
  });

  splashScreen.loadURL(
    isDev
      ? `file://${join(__dirname, '../../public/splash_screen.html')}`
      : `file://${join(__dirname, '../splash_screen.html')}`
  );
}

function closeSplashScreen() {
  splashScreen?.close();
  splashScreen = null;
}

function createMainWindow() {
  let mainWindowReady = false;

  mainWindow = new BrowserWindow({
    ...WINDOW_SIZE,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    transparent: true,
    frame: false,
    titleBarStyle: 'hidden',
    icon: iconPath
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${join(__dirname, '../index.html')}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require('electron-devtools-installer');

    mainWindow.webContents.openDevTools();

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => {
        console.log(`Added Extension:  ${name}`);
      })
      .catch((err: string) => {
        console.log('An error occurred: ', err);
      });
  }

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    mainWindowReady = true;
  });

  // This will wait at least for two seconds before showing the main window.
  const showMainWindowInterval = setInterval(() => {
    if (mainWindow && mainWindowReady) {
      clearInterval(showMainWindowInterval);

      closeSplashScreen();

      mainWindow.show();
      mainWindow.focus();
    }
  }, SPLASH_SCREEN_MIN_TIME);

  mainWindow.on('closed', () => (mainWindow = null));
}

function createWindow() {
  showSplashScreen();
  createMainWindow();
}

// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function () {
  createWindow();
  if (!isDev) autoUpdater.checkForUpdates();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  mainWindow && createWindow();
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents.send('updateReady');
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on('quitAndInstall', () => {
  autoUpdater.quitAndInstall();
});
