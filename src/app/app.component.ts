import { Component } from '@angular/core';
import { UserService } from './core/services/user/user.service';
import { version } from '../../package.json';
import { ConfigService } from './core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  /*
  - Text parser
    * Supported file types? also support docx? What about encoding?
    * How should it work? Save metadata in folder or copy contents and create firefinger-files?
    * Should also track progress (which courses have been finished by that user?)
  - Theme switcher: https://github.com/marcos-dev/ionic-theme-switcher
  - Stats, error tracking, timer when leaving application mid session?
  - Save session in progress for that user
  - Fingers to use etc.
  - Import old mechanics? Image descriptors
  - Make the behaviour while typing texts more modular, extendable
    * To consider: neurovisual disabilities
    * To consider: multiline texts?
  - Fix tsconfig paths (@app/core/...)

*/

  public appPages = [
    { title: 'Home', url: 'home', icon: 'home', accesskey: '1' },
    { title: 'Editor', url: 'editor', icon: 'pencil', accesskey: '2' },
    { title: 'Chapters', url: 'chapters', icon: 'book', accesskey: '3' },
    { title: 'Texts', url: 'texts', icon: 'document-text', accesskey: '4' },
    { title: 'Settings', url: '/settings/', icon: 'settings', accesskey: '5' },
  ];
  version = version;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private translate: TranslateService
  ) {
    this.userService.prepare();
    this.configService.prepare();
    this.translate.setDefaultLang('en');
    this.translate.use('de');
    // TODO: load dark mode?
  }

  getUsername() {
    if (!this.userService.username) {
      return '[Please login]';
    } else {
      return this.userService.username;
    }
  }

  openLink(link: string) {
    window.location.href = link;
  }
}
