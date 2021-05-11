import { Component } from '@angular/core';
import { UserService } from './core/services/user/user.service';
import { version } from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  /*
  - Text parser
    * Supported file types? also support docx? What about encoding?
  - Theme switcher: https://github.com/marcos-dev/ionic-theme-switcher
  - Stats, error tracking, timer when leaving application mid session?
  - Save session in progress for that user
  - Fingers to use etc.
  - Import old mechanics? Image descriptors
  - Make the behaviour while typing texts more modular, extendable
    * To consider: neurovisual disabilities
    * To consider: multiline texts?

*/

  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Chapters', url: 'chapters', icon: 'book' },
    { title: 'Texts', url: 'texts', icon: 'document-text' },
    { title: 'Settings', url: '/settings/', icon: 'settings' },
  ];
  version = version;
  constructor(private userService: UserService) {
    this.userService.prepare();
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
