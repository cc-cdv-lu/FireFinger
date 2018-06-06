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

  constructor(session: SessionService) {
    this.view = VIEW.LINE;
    this.index += 0;

    session.test();
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

  // Session data
  index = 0;
  input: String = "This is an example text! The text that is present in it does not have any importance. The text just needs to act as lorem ipsum...";
  mistakes = 0;

  // Statistics
  /*
    * record which keys had the most mistakes
    * record speed
    * ...
  */

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    //console.log(event);
    let key = event.key;
    this.checkSpeed();
    if (key == "Shift") return;
    if (this.index >= this.input.length - 1) {
      // Check if fast enough & didn't make to many mistakes
      this.index = 0;
    }
    if (key == this.getCurrentChar(this.input, this.index))
      this.index++;
    else {
      console.log("Entered " + key + " instead of " + this.getCurrentChar(this.input, this.index));
      this.mistakes++;
    }
  }

  iLastTime = 0;
  iTime = 0;
  iTotal = 0;
  iKeys = 0;

  cpm = 0;
  wpm = 0;
  checkSpeed() {
    this.iTime = new Date().getTime();

    if (this.iLastTime != 0) {
      this.iKeys++;
      this.iTotal += this.iTime - this.iLastTime;
      this.cpm = Math.round(this.iKeys / this.iTotal * 6000);
    }

    this.iLastTime = this.iTime;
  }


  ngOnInit() {
  }

  getCurrentChar(input, index) {
    return input[index];
  }

  getPrevSegment(input, index) {
    switch (this.view) {
      case VIEW.CHAR: return "";
      case VIEW.WORD: return this.getWordAt(input, index); //TODO only return start of word
      case VIEW.LINE: return input.substring(0, index);
    }
    return "";
  }

  getNextSegment(input, index) {
    switch (this.view) {
      case VIEW.CHAR: return "";
      case VIEW.CHAR: return this.getWordAt(input, index);  //TODO only return rest of word
      case VIEW.LINE: return input.substring(index + 1);
    }
  }

  getWordAt(str, pos) {

    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
      right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);

  }

  attemptHighlight(char: string) {
    if (!char) return;
    if (char.length > 1) return "";
    if (char == " ") return "_";
    if (char == "\n") return "<_";
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

  getMistakePercentage() {
    return Math.round(this.mistakes / this.input.length * 100) + "%";
  }

  printInfo() {
    console.log("Start:   ", this.getPrevSegment(this.input, this.index))
    console.log("Current: ", this.getCurrentChar(this.input, this.index))
    console.log("Next:    ", this.getNextSegment(this.input, this.index))
  }

}