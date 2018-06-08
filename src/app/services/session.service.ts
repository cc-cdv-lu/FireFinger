import { Injectable, HostListener } from '@angular/core';

import { StatisticsService, Statistics } from './statistics.service';
import { LessonService, Lesson, Chapter } from './lesson.service';
import { UserService, User } from './user.service';
import { ElectronService } from '../providers/electron.service'

enum VIEW {
  CHAR, WORD, LINE
}

const LAST_SESSION_KEY = 'LAST_SESSION'
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
  indexInText = 0;
  isSessionLoaded = false;

  constructor(private stats: StatisticsService, private lesson: LessonService, private user: UserService, private electron: ElectronService) { }

  handleKeyEvent(event: KeyboardEvent) {
    //console.log(event);
    let pressedKey = event.key;
    let expectedKey = this.getCurrentChar(this.getText(), this.indexInText)
    this.stats.checkSpeed();
    if (pressedKey == "Escape") return this.reset();
    if (pressedKey == "Shift") return;
    if (this.indexInText >= this.getText().length - 1) {
      // Check if fast enough & didn't make to many mistakes
      console.log("DONE!", this.currentChapter);
      this.user.loggedInUser.lastSessionStats = this.stats.currentStats;
      this.user.loggedInUser.lastSessionStats.mistakePercentage = this.getMistakePercentageAsNumber();

      this.user.recalculateOverallStats();
      this.user.saveUserChanges();
      this.reset();
    }
    if (pressedKey == 'Enter' && this.getCurrentChar(this.getText(), this.indexInText) == '\n')
      this.indexInText++;
    if (pressedKey == this.getCurrentChar(this.getText(), this.indexInText))
      this.indexInText++;
    else {
      console.log("Entered " + pressedKey + " instead of " + expectedKey);
      this.stats.logMistakes(pressedKey, expectedKey)
    }
  }

  reset() {
    this.indexInText;
    this.stats.reset();
    this.isSessionLoaded = false;
  }

  getText() {
    if (!this.currentLesson) return "No lesson loaded...";
    return this.currentLesson.chapters[this.currentIndex].content;
  }

  getIndex() {
    return this.indexInText;
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

  saveSession() {
    let session = {
      lesson: this.currentLesson,
      chapter: this.currentChapter,
      index: this.currentIndex
    }
    this.electron.config.set(LAST_SESSION_KEY, session);
  }
  restoreSession() {
    let session = this.electron.config.get(LAST_SESSION_KEY);
    if (!session) {
      this.isSessionLoaded = false;
      return console.log("No previous session was found...");
    }
    this.currentLesson = session.lesson;
    this.currentChapter = session.chapter;
    this.currentIndex = session.index;
    this.isSessionLoaded = true;
  }

  currentLesson: Lesson;
  currentChapter: Chapter;
  currentIndex: number;
  loadSession(lesson: Lesson, index: number) {
    this.reset();
    this.currentLesson = lesson;
    this.currentChapter = lesson.chapters[index];;
    this.currentIndex = index;
    this.isSessionLoaded = true;
    this.saveSession();
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
  }

  previousChapter() {
    if (this.currentIndex > 0) {
      this.loadSession(this.currentLesson, this.currentIndex - 1)
    }
    else {
      console.log("Reached beginning of lesson")
    }
  }
}
