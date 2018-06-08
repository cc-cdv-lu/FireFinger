import { Injectable, HostListener } from '@angular/core';

import { StatisticsService, Statistics } from './statistics.service';
import { LessonService, Lesson, Chapter } from './lesson.service';
import { UserService, User } from './user.service';

enum VIEW {
  CHAR, WORD, LINE
}


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
    //input: "This is an example text! The text that is present in it does not have any importance. The text just needs to act as lorem ipsum...",
  }

  constructor(private stats: StatisticsService, private lesson: LessonService, private user: UserService) { }

  handleKeyEvent(event: KeyboardEvent) {
    //console.log(event);
    let pressedKey = event.key;
    let expectedKey = this.getCurrentChar(this.getText(), this.session.index)
    this.stats.checkSpeed();
    if (pressedKey == "Escape") return this.reset();
    if (pressedKey == "Shift") return;
    if (this.session.index >= this.getText().length - 1) {
      // Check if fast enough & didn't make to many mistakes
      console.log("DONE!", this.session);
      this.user.loggedInUser.lastSessionStats = this.stats.currentStats;
      this.user.loggedInUser.lastSessionStats.mistakePercentage = this.getMistakePercentageAsNumber();

      this.user.recalculateOverallStats();
      this.user.saveUserChanges();
      this.reset();
    }
    if (pressedKey == 'Enter' && this.getCurrentChar(this.getText(), this.session.index) == '\n')
      this.session.index++;
    if (pressedKey == this.getCurrentChar(this.getText(), this.session.index))
      this.session.index++;
    else {
      console.log("Entered " + pressedKey + " instead of " + expectedKey);
      this.stats.logMistakes(pressedKey, expectedKey)
    }
  }

  reset() {
    this.session = {
      index: 0,
      //input: ""
    }
    this.stats.reset();
  }

  getText() {
    if (!this.currentLesson) return "No lesson loaded...";
    return this.currentLesson.chapters[this.currentIndex].content;
  }

  getIndex() {
    return this.session.index
  }

  getMistakePercentageAsNumber() {
    if (this.getText().length < 1) return 0;
    return Math.round(this.stats.currentStats.mistakesCount / this.getText().length * 100);

  }

  getMistakePercentage() {
    return this.getMistakePercentageAsNumber() + '%'
  }


  getCurrentChar(input, index) {
    if (!input) return "";
    return input[index];
  }

  getPrevSegment(input, index, view: VIEW) {
    if (!input) return "";
    switch (view) {
      case VIEW.CHAR: return "";
      case VIEW.WORD: return this.getBeginningOfWord(input, index);
      case VIEW.LINE: return this.getBeginningOfLine(input, index);
    }
    return "";
  }

  getNextSegment(input, index, view: VIEW) {
    if (!input) return "";
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

  currentLesson: Lesson;
  currentChapter: Chapter;
  currentIndex: number;
  loadSession(lesson: Lesson, index: number) {
    this.currentLesson = lesson;
    this.currentChapter = lesson.chapters[index];;
    this.currentIndex = index;

    //TODO try to get rid of input and load stuff straight from the lesson
    //this.session.input = this.currentChapter.content;
  }

  index = 0;
  nextChapter() {
    if (!this.currentLesson) return console.log("No lesson loaded...");
    if (this.currentIndex < this.currentLesson.chapters.length - 1) {
      this.loadSession(this.currentLesson, this.currentIndex + 1)
    }
    else {
      //TODO reached end of chapters
      console.log("Reached end of lesson!");
    }
    //TODO make it so that sessions are loaded by supplying a index with an lesson array
    //this.loadSession(this.lesson.lessons["braille"][this.index].content, this.lesson.lessons["braille"][this.index].title, this.user.loggedInUser);
  }

  previousChapter() {
    if (this.currentIndex > 1) {
      this.loadSession(this.currentLesson, this.currentIndex - 1)
    }
    else {
      console.log("Reached beginning of lesson")
    }
  }
}
