const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

const SPLASH_SCREEN_MIN_TIME = 2000;
const SPLASH_SCREEN_SIZE = {
  width: 600,
  height: 400,
};
const WINDOW_SIZE = {
  width: 1400,
  height: 900,
};

// Add IPC listeners
require('./check_requirements.js');
require('./install_local_cluster.js');
require('./connect_to_remote_cluster.js');
require('./store.js');

let mainWindow;
let splashScreen;

function showSplashScreen() {
  splashScreen = new BrowserWindow({
    ...SPLASH_SCREEN_SIZE,
    frame: false,
    backgroundColor: '#060606',
  });

  splashScreen.loadURL(
    isDev
      ? `file://${path.join(__dirname, '../public/splash_screen.html')}`
      : `file://${path.join(__dirname, '../build/splash_screen.html')}`
  );
}

function closeSplashScreen() {
  splashScreen.close();
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
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require('electron-devtools-installer');

    mainWindow.webContents.openDevTools();

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => {
        console.log(`Added Extension:  ${name}`);
      })
      .catch((err) => {
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
  mainWindow.webContents.send('updateReady');
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
electron.ipcMain.on('quitAndInstall', () => {
  autoUpdater.quitAndInstall();
});
