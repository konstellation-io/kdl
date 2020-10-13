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
  width: 900,
  height: 680,
};

let mainWindow;
let splashScreen;

function showSplashScreen() {
  splashScreen = new BrowserWindow({
    ...SPLASH_SCREEN_SIZE,
    frame: false,
    backgroundColor: '#060b15',
  });

  splashScreen.loadURL(
    `file://${path.join(__dirname, '../public/splash_screen.html')}`
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
    },
    transparent: true,
    // frame: false,   // TODO: set this to true after creating a custom title bar
    titleBarStyle: 'hidden',
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
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
