import { app, BrowserWindow, screen, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
const log = require('electron-log');
import * as path from 'path';
import * as url from 'url';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

// -------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
// -------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.info('====================FireFinger===================');
log.info('App starting...');

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  /*
  if (serve) {
    win.webContents.openDevTools();
  }
  */

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);
  app.on('ready', () => {
    win.webContents.on('crashed', err => {
      log.error('FireFinger crashed!', err);
    });
    win.webContents.on('unresponsive', err => {
      log.error('FireFinger has become unresponsive!', err);
    });
    process.on('uncaughtException', err => {
      log.error('FireFinger has encounterd an uncaugt exception!', err);
    });
    autoUpdater
      .checkForUpdatesAndNotify()
      .then(() => log.info('Checking for update...'));
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('app_version', event => {
    event.sender.send('app_version', { version: app.getVersion() });
  });
  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

  if (!serve) {
    autoUpdater.on('update-available', () => {
      log.info('Update available!');
      win.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
      log.info('Update downloaded!');
      win.webContents.send('update_downloaded');
    });
  }
} catch (e) {
  // Catch Error
  // throw e;
}
