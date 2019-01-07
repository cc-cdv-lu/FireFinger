import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

import * as Config from 'electron-store';
import BrowserWindow = Electron.BrowserWindow;

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  app: Electron.App;
  path: typeof path;
  shell: typeof Electron.shell;

  config: typeof Config;
  window: BrowserWindow;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs-extra');

      this.window = window.require('electron').remote.getCurrentWindow();
      const ConfigClass = window.require('electron-store');
      this.config = new ConfigClass();
      console.log('Config location: ', this.config);

      this.app = this.remote.app;
      this.shell = this.remote.shell;
      this.path = window.require('path');
    }

    if (this.isDev()) {
      this.openDevTools();
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
  }

  openDevTools() {
    this.window.webContents.openDevTools();
  }
}
