import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';

import childProcess from 'child_process';
import fs from 'fs-extra';
import path from 'path';

import ElectronStore from 'electron-store';
import BrowserWindow = Electron.BrowserWindow;

@Injectable()
export class ElectronService {
  ipcRenderer = ipcRenderer;
  webFrame = webFrame;
  remote = remote;
  childProcess = childProcess;
  path = path;
  fs = fs;

  app: Electron.App;
  window: BrowserWindow;
  shell: typeof Electron.shell;

  config = new ElectronStore();

  constructor() {
    this.window = this.remote.getCurrentWindow();
    this.app = this.remote.app;
    this.shell = this.remote.shell;

    if (this.isDev() || true) {
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
    this.window.webContents.openDevTools();
  }
}
