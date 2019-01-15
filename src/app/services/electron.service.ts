import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import Electron from 'electron';
import ElectronStore from 'electron-store';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof Electron.ipcRenderer;
  remote = Electron.remote;
  webFrame: typeof Electron.webFrame;

  app: Electron.App;
  shell: typeof Electron.shell;
  window: Electron.BrowserWindow;

  config = new ElectronStore();

  constructor() {
    this.window = this.remote.getCurrentWindow();

    if (this.isElectron()) {
      this.ipcRenderer = Electron.ipcRenderer;
      this.webFrame = Electron.webFrame;
      this.remote = Electron.remote;

      this.app = this.remote.app;
      this.shell = this.remote.shell;
    }

    if (this.isDev() || true) {
      this.openDevTools();
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  isDev() {
    if (process.mainModule) {
      return process.mainModule.filename.indexOf('app.asar') === -1;
    } else {
      return false;
    }
  }

  openDevTools() {
    this.window.webContents.openDevTools();
  }
}
