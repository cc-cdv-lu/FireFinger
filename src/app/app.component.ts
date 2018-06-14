import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private translate: TranslateService) {
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
}
