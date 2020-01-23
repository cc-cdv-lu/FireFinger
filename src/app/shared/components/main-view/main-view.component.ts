import { Component, OnInit, HostListener, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';

import {
  ElectronService,
  StyleService,
  SessionService,
  StatisticsService,
  UserService,
  ReaderService,
  VIEW,
  KeyHandlerService,
} from '../../../core';

import { SettingsComponent } from '../../../pages/';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  warningText = '';
  areSettingsOpen = false;
  constructor(
    public session: SessionService,
    private electron: ElectronService,
    private dialog: MatDialog,
    public style: StyleService,
    public stats: StatisticsService,
    private user: UserService,
    private router: Router,
    public translate: TranslateService,
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

    this.view = VIEW.LINE;

    document.documentElement.style.fontSize = '20px';

    // console.log('Using font:', this.style.font_family);

    // this.reader.play('FireFinger', 2);
    setTimeout(() => {
      this.reader.play(this.session.getCurrentChar(), 0);
    }, 500);
  }

  activateDebug = false;
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.blurAllButtons();
    this.keyHandler.handleKeyEvent(event);
  }
  ngOnInit() {
    this.session.focusInput();
  }

  /* Shortcuts */
  getPrev() {
    return this.session.getPrevSegment(this.view);
  }

  getNext() {
    return this.session.getNextSegment(this.view);
  }
  getCurrentForBraille() {
    if (!this.session.getCurrentChar()) {
      return '';
    }
    // https://www.fileformat.info/info/unicode/char/2880/index.htm
    // Replace new line char with point-8 (Enter-Button on braille display)
    return this.session.getCurrentChar().replace('\n', '\u2880');
  }

  getCurrentWithHighlight() {
    const char = this.attemptHighlight(this.session.getCurrentChar());

    return char;
  }

  getReadingLang() {
    return this.reader.config.voice_id;
  }

  shouldFlash() {
    return this.session.last_wrong_char !== '' && this.style.warning_flash;
  }

  shouldHideFocus() {
    return this.style.hide_focus;
  }

  shouldShowGuideline() {
    return this.style.show_guideline;
  }

  isInFocus(): boolean {
    return document.activeElement.id === 'inputLetter';
  }

  getWarningText() {
    let output = '';
    if (!this.session) {
      return output;
    }
    const c: string = this.session.getCurrentChar();
    if (!c) {
      return output;
    }
    switch (c) {
      case '\n':
        return this.translate.instant('keys.enter');
      case ' ':
        return this.translate.instant('keys.space');
      // tslint:disable-next-line:quotemark
      case "'":
        return this.translate.instant('keys.apostrophe');
      case 'ä':
      case 'Ä':
      case 'ü':
      case 'Ü':
      case 'ö':
      case 'Ö':
        output += this.translate.instant('keys.umlaut');
    }

    // Check if the letter is uppercase
    if (c.toLowerCase() !== c) {
      if (output !== '') {
        output += '\n';
      }
      output += this.translate.instant('keys.uppercase');
    }
    return output;
  }

  attemptHighlight(char: string) {
    // reached end of chapter
    if (char === undefined) {
      return '✓';
    }
    if (!char) {
      return;
    }
    if (char.length > 1) {
      return '';
    }
    if (char === ' ') {
      return '_';
    }
    // reached end of line
    if (char === '\n') {
      return '↲';
    }
    return char;
  }

  setViewMode(newVIEW: VIEW) {
    this.view = newVIEW;
  }

  get view() {
    if (this.session.getCurrentChapter()) {
      return this.session.getCurrentChapter().type;
    } else {
      return VIEW.LINE;
    }
  }
  set view(v: any) {
    console.log('No longer supported...');
  }

  /* DEBUG stuff */

  blurAllButtons() {
    const buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).blur();
    }
  }

  nukeElectronStorage() {
    this.electron.config.clear();
  }

  skipLetter() {
    this.session.nextTextIndex();
  }
}
