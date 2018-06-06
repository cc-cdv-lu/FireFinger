import { Component, OnInit, HostListener } from '@angular/core';
import { SessionService } from '../../services/session.service';

import { ColorSchemes } from '../../shared/const';

export enum VIEW {
  CHAR, WORD, LINE
}

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  /* TODO
  * input letters to views
  * input current word set oooor whole text with ref to index
  */

  constructor(private session: SessionService) {
    this.view = VIEW.LINE;

    session.reset();

    session.loadLesson(3);
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
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
    fontSize: this.fontSize + "px",
    colorScheme: ColorSchemes.inverted
  }
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

}
