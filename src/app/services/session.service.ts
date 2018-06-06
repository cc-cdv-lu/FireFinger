import { Injectable, HostListener } from '@angular/core';
import { VIEW } from '../components/main-view/main-view.component';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // Statistics
  /*
    * record which keys had the most mistakes
    * record speed
    * ...
  */


  // Session data
  session = {
    index: 0,
    input: "This is an example text! The text that is present in it does not have any importance. The text just needs to act as lorem ipsum...",
    mistakes: 0
  }

  constructor() {
  }


  /*TODO move to KeyProcessorService */
  handleKeyEvent(event: KeyboardEvent) {
    //console.log(event);
    let key = event.key;
    this.checkSpeed();
    if (key == "Shift") return;
    if (this.session.index >= this.session.input.length - 1) {
      // Check if fast enough & didn't make to many mistakes
      this.session.index = 0;
    }
    if (key == this.getCurrentChar(this.session.input, this.session.index))
      this.session.index++;
    else {
      console.log("Entered " + key + " instead of " + this.getCurrentChar(this.session.input, this.session.index));
      this.session.mistakes++;
    }
  }

  reset() {
    this.session = {
      index: 0,
      input: "This is an example text! The text that is present in it does not have any importance. The text just needs to act as lorem ipsum...",
      mistakes: 0
    }

    this.iLastTime = 0;
    this.iTime = 0;
    this.iTotal = 0;
    this.iKeys = 0;

    this.cpm = 0;
    this.wpm = 0;
  }

  getText() {
    return this.session.input;
  }

  getIndex() {
    return this.session.index
  }

  getMistakePercentage() {
    return Math.round(this.session.mistakes / this.session.input.length * 100) + "%";
  }


  getCurrentChar(input, index) {
    return input[index];
  }

  getPrevSegment(input, index, view: VIEW) {
    switch (view) {
      case VIEW.CHAR: return "";
      case VIEW.WORD: return this.getWordAt(input, index); //TODO only return start of word
      case VIEW.LINE: return input.substring(0, index);
    }
    return "";
  }

  getNextSegment(input, index, view: VIEW) {
    switch (view) {
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
}
