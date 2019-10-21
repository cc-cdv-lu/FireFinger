import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {
  ipcRenderer,
  webFrame,
  remote,
  shell,
  BrowserWindow,
  BrowserView,
  App
} from 'electron';
import * as ElectronStore from 'electron-store';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  remote: any; // = typeof remote;
  webFrame: typeof webFrame;

  app: App;
  shell: typeof shell;
  window: typeof BrowserWindow;

  config = new ElectronStore();

  devOverwrite = false;

  constructor() {
    // this.window = Electron.remote.getCurrentWindow();

    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.app = this.remote.app;
      this.shell = window.require('electron').shell;
      console.log(this.remote, this.app, this.shell);
    }

    if (this.isDev() || this.devOverwrite) {
      this.openDevTools();
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  isDev() {
    if (process.mainModule) {
      return process.mainModule.filename.indexOf('app.asar') === -1;
    } else {
      return false;
    }
  }

  openDevTools() {
    // window.require('electron').webContents.openDevTools();
    // this.window.webContents.openDevTools();
  }
}
