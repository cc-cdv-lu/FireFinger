import { Component, HostListener } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

import { StyleService } from './services/style.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 107 && event.ctrlKey) return this.style.increaseFont();
    if (event.keyCode == 109 && event.ctrlKey) return this.style.decreaseFont();

  }

  constructor(public electronService: ElectronService,
    private translate: TranslateService, private style: StyleService) {
    translate.addLangs(['de', 'fr', 'en']);

    let lang = this.electronService.config.get("LANG");
    if (!lang) lang = 'de';

    translate.setDefaultLang(lang);
    translate.use(lang);

    //console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      //console.log('Electron ipcRenderer', electronService.ipcRenderer);
      //console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }
  ngOnInit() {
    // immediately maximize window after component initalization
    this.electronService.window.maximize();
    this.electronService.window.setFullScreen(true);
  }

  /* DEBUG stuff */

  blurAllButtons() {
    let buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).blur()
    }
  }

}
