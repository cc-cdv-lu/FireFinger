import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../../providers/electron.service';
import { MatDialog } from '@angular/material';

import { SettingsComponent } from '../settings/settings.component';

import { StyleService } from '../../services/style.service';
import { SessionService } from '../../services/session.service';
import { StatisticsService } from '../../services/statistics.service';
import { UserService } from '../../services/user.service';
import { ReaderService } from '../../services/reader.service';

import { TranslateService } from '@ngx-translate/core';

enum VIEW {
  CHAR, WORD, LINE
}

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor(public session: SessionService, private electron: ElectronService, private dialog: MatDialog,
    public style: StyleService, public stats: StatisticsService, private user: UserService, private router: Router,
    public translate: TranslateService) {
    //TODO - LEVEL selection is triggered before login creation
    let lastLogin = this.electron.config.get("LAST_LOGIN");
    if (!lastLogin)
      this.router.navigateByUrl('/login');
    if (lastLogin)
      this.user.login(lastLogin.name);

    this.session.restoreSession();
    if (!this.session.isSessionLoaded)
      this.router.navigateByUrl('/levels');

    this.view = VIEW.LINE;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.blurAllButtons();
    if (this.areSettingsOpen) return;
    this.session.handleKeyEvent(event);
  }
  ngOnInit() {

  }

  VIEW = VIEW;
  view: VIEW = VIEW.LINE;
  warningText = "";

  areSettingsOpen: boolean = false;

  factor = 7;
  getRowHeight() {
    return this.style.fontSize / this.factor + "px";
  }

  /* Shortcuts */
  getPrev() {
    return this.session.getPrevSegment(this.view)
  }

  getNext() {
    return this.session.getNextSegment(this.view)

  }

  getCurrent() {
    return this.attemptHighlight(this.session.getCurrentChar())
  }

  getWarningText() {
    let c = this.session.getCurrentChar();
    switch (c) {
      case "\n": return this.translate.instant('keys.enter');
      case " ": return this.translate.instant('keys.space');
      case "ä": case "Ä": case "ü": case "Ü": case "ö": case "Ö": return this.translate.instant('keys.umlaut')
      //TODO add großschrift
      default: return "";
    }
  }


  attemptHighlight(char: string) {
    if (!char) return;
    if (char.length > 1) return "";
    if (char == " ") return "_";
    if (char == "\n") return "↲";
    return char;
  }

  /*
    Debugging
  */
  setCharMode() {
    this.setViewMode(VIEW.CHAR)
  }
  setWordMode() {
    this.setViewMode(VIEW.WORD)
  }
  setLineMode() {
    this.setViewMode(VIEW.LINE);
  }
  setViewMode(VIEW: VIEW) {
    this.view = VIEW;
  }

  printInfo() {
    console.log("Start:   ", this.session.getPrevSegment(this.view))
    console.log("Current: ", this.session.getCurrentChar())
    console.log("Next:    ", this.session.getNextSegment(this.view))
  }

  openSettings() {
    if (this.areSettingsOpen) return;
    this.areSettingsOpen = true;
    let dialogRef = this.dialog.open(SettingsComponent, {
      height: '80%',
      width: '55%',
      data: {
        electron_service: this.electron
      }
    });
    dialogRef.beforeClose().subscribe(() => {
      this.areSettingsOpen = false;
    })
  }

  blurAllButtons() {
    let buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons.item(i).blur()
    }
  }

  nukeElectronStorage() {
    this.electron.config.clear();
  }

  skipLetter() {
    this.session.nextTextIndex();
  }

}
