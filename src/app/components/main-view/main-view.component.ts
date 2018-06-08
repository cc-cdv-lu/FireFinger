import { Component, OnInit, HostListener } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { MatDialog } from '@angular/material';

import { SettingsComponent } from '../settings/settings.component';
import { LoginComponent } from '../login/login.component';

import { StyleService } from '../../services/style.service';
import { SessionService } from '../../services/session.service';
import { StatisticsService } from '../../services/statistics.service';
import { UserService } from '../../services/user.service';


enum VIEW {
  CHAR, WORD, LINE
}

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor(public session: SessionService, private electron: ElectronService, private dialog: MatDialog, public style: StyleService, public stats: StatisticsService, private user: UserService) {
    this.view = VIEW.LINE;
    let tempUser = this.electron.config.get("LAST_LOGIN");
    let name = "";
    if (tempUser) name = tempUser.name

    this.isLoginOpen = true;
    let loginDialog = this.dialog.open(LoginComponent, {
      height: '10%',
      width: '40%',
      autoFocus: true,
      closeOnNavigation: false,
      disableClose: true,
      hasBackdrop: true,
      data: {
        name: name
      }
    });
    loginDialog.beforeClose().subscribe(() => {
      this.isLoginOpen = false;
      this.electron.config.set("LAST_LOGIN", this.user.loggedInUser);
    })

  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.areSettingsOpen || this.isLoginOpen) return;
    this.session.handleKeyEvent(event);
  }
  ngOnInit() {

  }

  VIEW = VIEW;
  view: VIEW = VIEW.LINE;
  warningText = "";

  areSettingsOpen: boolean = false;
  isLoginOpen: boolean = false;

  factor = 7;
  getRowHeight() {
    return this.style.fontSize / this.factor + "px";
  }

  /* Shortcuts */
  getPrev() {
    return this.session.getPrevSegment(this.session.getText(), this.session.getIndex(), this.view)
  }

  getNext() {
    return this.session.getNextSegment(this.session.getText(), this.session.getIndex(), this.view)

  }

  getCurrent() {
    return this.attemptHighlight(this.session.getCurrentChar(this.session.getText(), this.session.getIndex()))
  }

  getWarningText() {
    let c = this.session.getCurrentChar(this.session.getText(), this.session.getIndex());
    switch (c) {
      case "\n": return "Eingabe";
      case " ": return "Leerzeichen";
      case "ä": case "Ä": case "ü": case "Ü": case "ö": case "Ö": return "Umlaut"
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
    console.log("Start:   ", this.session.getPrevSegment(this.session.getText(), this.session.getIndex(), this.view))
    console.log("Current: ", this.session.getCurrentChar(this.session.getText(), this.session.getIndex()))
    console.log("Next:    ", this.session.getNextSegment(this.session.getText(), this.session.getIndex(), this.view))
  }

  skipLesson() {
    this.session.skipLesson();
  }

  openSettings() {
    if (this.areSettingsOpen) return;
    this.areSettingsOpen = true;
    let dialogRef = this.dialog.open(SettingsComponent, {
      height: '80%',
      width: '40%',
      data: {
        electron_service: this.electron
      }
    });
    dialogRef.beforeClose().subscribe(() => {
      this.areSettingsOpen = false;
    })
  }

}
