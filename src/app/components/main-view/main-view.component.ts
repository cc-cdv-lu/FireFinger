import { Component, OnInit, HostListener } from '@angular/core';
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

  /* Styling */
  style = {
    backgroundColor: "white",
    fontSize: "50vh",
    color: {
      current: 'black',
      prev: 'lightgray',
      next: 'lightgray'
    }
  }
  //TODO some hacky stuff
  getRowHeight() {
    let n = this.style.fontSize.split("vh")[0];
    return parseInt(n) * 1.5 + "%"
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
