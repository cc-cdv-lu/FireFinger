import { Component, OnInit, HostBinding, HostListener } from '@angular/core';

import {
  StyleService,
  SessionService,
  StatisticsService,
  ChapterType,
  ElectronService,
  UserService,
  ReaderService,
  KeyHandlerService,
} from '../../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.keyHandler.handleKeyEvent(event);
    this.blurAllButtons();
  }
  constructor(
    public stats: StatisticsService,
    public style: StyleService,
    public session: SessionService,
    private electron: ElectronService,
    private user: UserService,
    private router: Router,
    private reader: ReaderService,
    private keyHandler: KeyHandlerService
  ) {
    let lastLogin: any;
    if (this.electron.config) {
      lastLogin = this.electron.config.get('LAST_LOGIN');
    }

    this.session.restoreSession();
    if (!this.session.isSessionLoaded) {
      this.router.navigateByUrl('/levels');
    }

    if (lastLogin !== undefined) {
      this.user.login(lastLogin.name);
    } else {
      this.router.navigateByUrl('/login');
    }

    // document.documentElement.style.fontSize = '20px';

    // console.log('Using font:', this.style.font_family);

    // this.reader.play('FireFinger', 2);
    if (this.session.getChapterType() !== ChapterType.SIMPLE) {
      setTimeout(() => {
        this.reader.play(this.session.getCurrentChar(), 0);
      }, 500);
    }
  }

  ngOnInit() {
    this.componentCssClass = this.style.theme;
    // The following line needs to be present for the font size to be applied
    this.style.font = this.style.font;
  }

  isSimple() {
    return this.session.getChapterType() === ChapterType.SIMPLE;
  }

  blurAllButtons() {
    const buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).blur();
    }
  }
}
