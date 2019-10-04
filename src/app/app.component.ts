import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';

import { OverlayContainer } from '@angular/cdk/overlay';
import { StyleService } from './services/style.service';
import { SettingsComponent } from './components/settings/settings.component';
import { UserService } from './services/user.service';
import { SessionService } from './services/session.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  routerLinks: Array<any>;

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
    public electron: ElectronService,
    private translate: TranslateService,
    public overlayContainer: OverlayContainer,
    public style: StyleService,
    public settings: SettingsComponent,
    public router: Router,
    private session: SessionService,
    public user: UserService,
    dialog: MatDialog
  ) {
    this.overlayContainer
      .getContainerElement()
      .classList.add(this.style.getThemes());

    translate.addLangs(['de', 'fr', 'en']);

    let lang: string;
    if (this.electron.config) {
      lang = this.electron.config.get('LANG');
    }
    if (!lang) {
      lang = 'de';
    }

    translate.setDefaultLang(lang);
    translate.use(lang);

    document.documentElement.lang = lang;

    translate.onLangChange.subscribe(
      (data: any) => (document.documentElement.lang = data.lang)
    );

    if (electron.isElectron()) {
      console.log('Mode electron');
    } else {
      console.log('Mode web');
    }

    this.routerLinks = [
      {
        name: this.translate.get('nav.home'),
        link: '/home',
        icon: 'home',
        shortcut: '1',
      },
      {
        name: this.translate.get('nav.settings'),
        link: '/settings',
        icon: 'settings',
        shortcut: '2',
      },
      {
        name: this.translate.get('nav.levels'),
        link: '/levels',
        icon: 'bookmarks',
        shortcut: '3',
      },
      {
        name: this.translate.get('nav.login'),
        link: '/login',
        icon: 'person',
        shortcut: '4',
      },
    ];

    this.user.userChanged.subscribe((username: string) => {
      const namePromise = new Promise((resolve, reject) => {
        resolve(username);
      });
      this.routerLinks[3].name = username
        ? namePromise
        : this.translate.get('nav.login');
    });
  }

  ngOnInit() {
    // immediately maximize window after component initalization
    this.electron.window.maximize();
    this.electron.window.setFullScreen(true);

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
    this.session.saveSession();
    if (this.electron.window) {
      this.electron.window.close();
    } else {
      window.close();
    }
  }
}
