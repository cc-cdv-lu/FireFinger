import { Component, OnInit, HostBinding } from '@angular/core';
import { ElectronService, StyleService } from '../../../core';

@Component({
  selector: 'app-self-updater',
  templateUrl: './self-updater.component.html',
  styleUrls: ['./self-updater.component.scss'],
})
export class SelfUpdaterComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  version = '';
  constructor(private electron: ElectronService, public style: StyleService) {}

  ngOnInit() {
    const notification = document.getElementById('notification');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');

    this.electron.ipcRenderer.send('app_version');
    this.electron.ipcRenderer.on('app_version', (event, arg) => {
      this.electron.ipcRenderer.removeAllListeners('app_version');
      this.version = arg.version;
      console.log('App version:', this.version);
    });

    this.electron.ipcRenderer.on('update_available', () => {
      this.electron.ipcRenderer.removeAllListeners('update_available');
      message.innerText = 'A new update is available. Downloading now...';
      notification.classList.remove('hidden');
    });

    this.electron.ipcRenderer.on('update_downloaded', () => {
      this.electron.ipcRenderer.removeAllListeners('update_downloaded');
      message.innerText =
        'Update Downloaded. It will be installed on restart. Restart now?';
      console.log('Update downloaded...');
      restartButton.classList.remove('hidden');
      notification.classList.remove('hidden');
    });
  }

  /* Auto update related */
  closeNotification() {
    document.getElementById('notification').classList.add('hidden');
  }
  restartApp() {
    this.electron.ipcRenderer.send('restart_app');
  }
}
