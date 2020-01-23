import { Injectable } from '@angular/core';
import * as Electron from 'electron';
import * as ElectronStore from 'electron-store';

@Injectable()
export class ElectronService {
  config = new ElectronStore();

  devOverwrite = false;
  ipcRenderer: typeof Electron.ipcRenderer;
  remote: typeof Electron.remote;
  webFrame: typeof Electron.webFrame;
  webContents: typeof Electron.webContents;

  dialog: typeof Electron.dialog;
  app: typeof Electron.remote.app;
  shell: typeof Electron.shell;
  window: Electron.BrowserWindow;

  constructor() {
    if (this.isElectron()) {
      // this.Electron = window.require('electron');
      this.ipcRenderer = Electron.ipcRenderer;
      this.remote = Electron.remote;
      this.webFrame = Electron.webFrame;
      this.webContents = Electron.WebContents;

      this.dialog = this.remote.dialog;
      this.app = this.remote.app;
      this.shell = Electron.shell;
      this.window = this.remote.BrowserWindow.getAllWindows()[0];

      this.app.focus();
      console.log(this.remote, this.app, this.shell, this.window);
    }

    if (this.isDev() || this.devOverwrite) {
      console.log('opening dev tools');
      this.openDevTools();
    }
    if (this.isAssistiveTechnologyEnabled()) {
      console.warn('User is using some kind of assistive technology...');
    }
  }

  isAssistiveTechnologyEnabled(): boolean {
    return this.app.accessibilitySupportEnabled;
  }

  isElectron(): boolean {
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
    this.remote.getCurrentWebContents().openDevTools();
  }
}
