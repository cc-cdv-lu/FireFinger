import { Injectable, HostListener } from '@angular/core';
import { VIEW } from '../components/main-view/main-view.component';

import { Lessons } from '../shared/tempLessons';

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

  user = {
    name: "",
    stats: {

    }
  }

  // Session data
  session = {
    index: 0,
    input: "This is an example text! The text that is present in it does not have any importance. The text just needs to act as lorem ipsum...",
    mistakes: 0
  }

  constructor() {
    console.log("Lessons:", Lessons);


  }


  /*TODO move to KeyProcessorService */
  handleKeyEvent(event: KeyboardEvent) {
    //console.log(event);
    let key = event.key;
    this.checkSpeed();
    if (key == "Escape") return this.reset();
    if (key == "Shift") return;
    if (this.session.index >= this.session.input.length - 1) {
      // Check if fast enough & didn't make to many mistakes
      console.log("DONE!", this.session);
      this.reset();
    }
    if (key == 'Enter' && this.getCurrentChar(this.session.input, this.session.index) == '\n')
      this.session.index++;
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
      input: "",
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
      case VIEW.WORD: return this.getBeginningOfWord(input, index);
      case VIEW.LINE: return this.getBeginningOfLine(input, index);
    }
    return "";
  }

  getNextSegment(input, index, view: VIEW) {
    switch (view) {
      case VIEW.CHAR: return "";
      case VIEW.WORD: return this.getRestOfWord(input, index);
      case VIEW.LINE: return this.getRestOfLine(input, index);
    }
  }

  getBeginningOfWord(str, pos) {
    let output = "";
    if (str[pos] == "\n" || str[pos] == " ") return output;

    for (let i = pos - 1; i > 0; i--) {
      if (str[i] != "\n" && str[i] != " ")
        output = str[i] + output;
      else
        return output
    }
    return output;
  }

  getRestOfWord(str, pos) {
    let output = "";
    if (str[pos] == "\n" || str[pos] == " ") return output;

    for (let i = pos + 1; i < str.length; i++) {
      if (str[i] != "\n" && str[i] != " ")
        output += str[i];
      else
        return output
    }
    return output;
  }

  // TODO this could be much cleaner
  getBeginningOfLine(str, pos) {
    let output = str[pos - 1];
    if (str[pos - 1] == "\n") return output;
    if (str[pos] == "\n") return this.getBeginningOfLine(str, pos - 1) + str[pos - 1];

    for (let i = pos - 2; i > 0; i--) {
      if (str[i] != "\n") {
        output = str[i] + output;
      }
      else return output;
    }

    return output;
  }

  getRestOfLine(str, pos) {
    let output = "";
    if (str[pos] == "\n") return output;
    for (let i = pos + 1; i < str.length; i++) {
      if (str[i] != "\n") output += str[i];
      else return output;
    }
    return output;
  }

  /* For reading out loud*/
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

  loadUser(username: string) {
    this.user = null; //TODO conf.get(username);
  }

  loadLesson(index) {
    this.session.input = Lessons[index].content;
  }
}
