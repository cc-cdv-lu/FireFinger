import { Component, OnInit, HostListener } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { MatDialog } from '@angular/material';

import { ColorSchemeService } from '../../services/color-scheme.service';
import { SettingsComponent } from '../settings/settings.component';
import { SessionService } from '../../services/session.service';


export enum VIEW {
  CHAR, WORD, LINE
}

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor(private session: SessionService, private electron: ElectronService, private dialog: MatDialog, private colorScheme: ColorSchemeService) {
    this.view = VIEW.LINE;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.areSettingsOpen) return;
    this.session.handleKeyEvent(event);
  }

  ngOnInit() {

  }

  VIEW = VIEW;
  view: VIEW = VIEW.CHAR;
  fontSize = 800;
  warningSize = this.fontSize / 8 + "px";
  warningText = "";

  /* Styling */
  style = {
    fontSize: this.fontSize + "px"
  }

  areSettingsOpen: boolean = false;

  //some hacky stuff
  getRowHeight_old() {
    let n = this.style.fontSize.split("vh")[0];
    return parseInt(n) * 1.5 + "%"
  }

  factor = 7;
  getRowHeight() {
    return this.fontSize / this.factor + "px";
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
