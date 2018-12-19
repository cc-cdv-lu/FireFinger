import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

import { OverlayContainer } from '@angular/cdk/overlay';
import { StyleService } from './services/style.service';
import { SettingsComponent } from './components/settings/settings.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  routerLinks;

  @HostBinding('class') componentCssClass;
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'ArrowUp' || event.key === '+') {
        return this.style.increaseFont();
      }
      if (event.key === 'ArrowDown' || event.key === '-') {
        return this.style.decreaseFont();
      }
    }
  }
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    public overlayContainer: OverlayContainer,
    public style: StyleService,
    public settings: SettingsComponent,
    private electron: ElectronService,
    public router: Router,
    public user: UserService
  ) {
    this.overlayContainer
      .getContainerElement()
      .classList.add(this.style.getThemes());

    translate.addLangs(['de', 'fr', 'en']);

    let lang = this.electronService.config.get('LANG');
    if (!lang) {
      lang = 'de';
    }

    translate.setDefaultLang(lang);
    translate.use(lang);

    if (electronService.isElectron()) {
      console.log('Mode electron');
    } else {
      console.log('Mode web');
    }

    this.routerLinks = [
      {
        name: this.translate.get('nav.home'),
        link: '/home',
        icon: 'home'
      },
      {
        name: this.translate.get('nav.settings'),
        link: '/settings',
        icon: 'settings'
      },
      {
        name: this.translate.get('nav.levels'),
        link: '/levels',
        icon: 'bookmarks'
      },
      {
        name: this.translate.get('nav.login'),
        link: '/login',
        icon: 'person'
      }
    ];

    this.user.userChanged.subscribe((username) => {
      const namePromise = new Promise((resolve, reject) => {
        resolve(username);
      });
      this.routerLinks[3].name = username ? namePromise : this.translate.get('nav.login');
    });
  }

  ngOnInit() {
    // immediately maximize window after component initalization
    this.electronService.window.maximize();
    this.electronService.window.setFullScreen(true);

    this.componentCssClass = this.style.theme;

  }

  /* DEBUG stuff */

  blurAllButtons() {
    const buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).blur();
    }
  }

  closeApp() {
    console.warn('Shutting game down...');
    if (this.electron.window) {
      this.electron.window.close();
    } else {
      window.close();
    }
  }
}
