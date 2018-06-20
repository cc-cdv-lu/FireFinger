import { Component, HostBinding, HostListener } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

import { OverlayContainer } from '@angular/cdk/overlay';
import { StyleService } from './services/style.service';
import { SettingsComponent } from './components/settings/settings.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  @HostBinding('class') componentCssClass;
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 107 && event.ctrlKey) return this.style.increaseFont();
    if (event.keyCode == 109 && event.ctrlKey) return this.style.decreaseFont();

  }
  routerLinks;
  constructor(public electronService: ElectronService,
    private translate: TranslateService, public overlayContainer: OverlayContainer, public style: StyleService, public settings: SettingsComponent, private electron: ElectronService) {

    this.overlayContainer.getContainerElement().classList.add(this.style.getThemes());

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

    this.routerLinks = [
      {
        name: this.translate.get('nav.home'),
        link: '/home'
      },
      {
        name: this.translate.get('nav.settings'),
        link: '/settings'
      },
      {
        name: this.translate.get('nav.levels'),
        link: '/levels'
      },
      {
        name: this.translate.get('nav.login'),
        link: '/login'
      }
    ]
  }



  ngOnInit() {
    // immediately maximize window after component initalization
    this.electronService.window.maximize();
    this.electronService.window.setFullScreen(true);

    this.componentCssClass = this.style.theme;
  }

  /* DEBUG stuff */

  blurAllButtons() {
    let buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).blur()
    }
  }


  closeApp() {
    console.warn("Shutting game down...");
    if (this.electron.window)
      this.electron.window.close();
    else
      window.close();
  }
}
