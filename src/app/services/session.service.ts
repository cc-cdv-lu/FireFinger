import { Injectable, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService } from '../providers/electron.service'

import { StatisticsService, Statistics } from './statistics.service';
import { LessonService, Lesson, Chapter } from './lesson.service';
import { UserService, User } from './user.service';
import { StringHelperService } from './string-helper.service';
import { ReaderService } from './reader.service';
import { SoundEffectService, SOUNDS } from './sound-effect.service';

const LAST_SESSION_KEY = 'LAST_SESSION';

export const enum GAME_STATE {
  PLAYING, SUCCESS, FAILURE
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  //TODO add this to settings
  maxMistakePercentage = 5; //in percentage
  maxMistakeCount = 50;  // as mistakes per session
  minTypeSpeed = 1;        //as characters per seconds? TODO revisit stats for this
  gameState = GAME_STATE.PLAYING;

  isSessionLoaded = false;

  // Session data
  private indexInText = 0;
  last_wrong_char = "";

  constructor(private stats: StatisticsService, private lesson: LessonService, private router: Router,
    private user: UserService, private electron: ElectronService, private sound: SoundEffectService,
    private stringHelper: StringHelperService, public reader: ReaderService) { }

  ignoreKeys = ["ContextMenu", "CapsLock", "Tab", "Insert", "Home", "PageUp", "PageDown", "Delete", "End", "Backspace", "Shift", "Control", "Alt", "AltGraph", "Meta", "Dead", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];

  shouldIgnore(key: string): boolean {
    /* If pressed key is part of the list, ignore it (return true)*/
    /* If it is not part of the list (indexOf = -1), true false */
    if (this.ignoreKeys.indexOf(key) == -1) return false;
    return true;
  }

  handleKeyEvent(event: KeyboardEvent) {
    if (!this.isSessionLoaded) return console.log("No session loaded...");

    // What should happen when level is over
    if (this.getIndex() >= this.getText().length) {
      return this.onEndOfChapter(event);
    }

    // Handle special keys
    let pressedKey = event.key;
    let expectedKey = this.stringHelper.getCurrentChar(this.getText(), this.getIndex())
    if (pressedKey == "Escape") return this.reset();
    if (this.shouldIgnore(pressedKey)) return;

    if (pressedKey == 'ArrowDown')
      return this.reader.play(this.getCurrentChar(), this.currentChapter.type)// play current char
    if (pressedKey == 'ArrowRight')
      return this.reader.play(this.stringHelper.getWordAt(this.getText(), this.getIndex()), 2);//play current word
    if (pressedKey == 'ArrowLeft') return;
    if (pressedKey == 'ArrowUp') return;



    //Default case
    if (pressedKey == this.getCurrentChar() || pressedKey == 'Pause')
      return this.nextTextIndex()
    // Special cases
    if (pressedKey == 'Enter' && this.getCurrentChar() == '\n')
      return this.nextTextIndex()

    if (this.getCurrentChar() == '�')
      return this.nextTextIndex()

    // If wrong letter was entered
    this.sound.play(SOUNDS.ERROR);
    if (pressedKey != this.last_wrong_char) {
      console.log("Entered " + pressedKey + " instead of " + expectedKey);
      this.last_wrong_char = pressedKey;
      this.stats.logMistakes(pressedKey, expectedKey)
      return;
    }

  }

  onEndOfChapter(event) {
    // Log success relevant values
    let mistakeCount = this.stats.currentStats.mistakesCount;
    let mistakePercentage = this.stats.currentStats.mistakesCount;
    let typeSpeed = this.stats.currentStats.typeSpeed;


    // Calculating overall stats
    this.user.loggedInUser.lastSessionStats = this.stats.currentStats;
    this.user.loggedInUser.lastSessionStats.mistakePercentage = this.getMistakePercentageAsNumber();
    this.user.recalculateOverallStats();
    this.user.saveUserChanges();


    // Check if fast enough & didn't make to many mistakes
    if (mistakeCount <= this.maxMistakeCount &&
      mistakePercentage <= this.maxMistakePercentage &&
      typeSpeed >= this.minTypeSpeed) {
      this.onSuccess();
    }

    else {
      if (mistakeCount > this.maxMistakeCount) console.log("Too many mistakes");
      if (mistakePercentage > this.maxMistakePercentage) console.log("Too high mistake percentage!");
      if (typeSpeed < this.minTypeSpeed) console.log("Too slow!");
      this.onFailure();
    }


    this.reset();
  }

  onSuccess() {
    this.nextChapter();
    console.log("BIG success! Next level coming up!");
    this.sound.play(SOUNDS.SUCCESS);
    this.gameState = GAME_STATE.SUCCESS;
    this.router.navigateByUrl('summary');
  }

  onFailure() {
    console.log("Better luck next time");
    this.sound.play(SOUNDS.FAILURE);
    this.gameState = GAME_STATE.FAILURE;
    this.router.navigateByUrl('summary');
  }

  reset() {
    this.indexInText = 0;
    this.stats.reset();
    this.isSessionLoaded = false;
  }

  getText() {
    if (!this.currentLesson) return "";
    if (!this.isSessionLoaded) {
      switch (this.gameState) {
        case GAME_STATE.SUCCESS: return "✌️";
        case GAME_STATE.FAILURE: return "👎";
        default: return "Something went wrong..."
      }
    }

    return this.currentLesson.chapters[this.currentIndex].content;
  }

  getIndex() {
    if (!this.indexInText) return 0;
    return this.indexInText;
  }

  getMistakePercentageAsNumber() {
    if (!this.getText()) return 0;
    if (this.getText().length < 1) return 0;
    return Math.round(this.stats.currentStats.mistakesCount / this.getText().length * 100);

  }

  getMistakePercentage() {
    return this.getMistakePercentageAsNumber() + '%'
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
    this.currentChapter = lesson.chapters[index];
    this.currentIndex = index;
    this.isSessionLoaded = true;
    this.saveSession();
  }

  getPrevSegment(view) {
    let str = this.getText();
    let index = this.getIndex();
    return this.stringHelper.getPrevSegment(str, index, view)
  }

  getNextSegment(view) {
    let str = this.getText();
    let index = this.getIndex();
    return this.stringHelper.getNextSegment(str, index, view)
  }

  getCurrentChar() {
    let str = this.getText();
    let index = this.getIndex();
    return this.stringHelper.getCurrentChar(str, index);
  }

  nextTextIndex() {
    this.last_wrong_char = "";
    this.stats.checkSpeed();

    if (this.getIndex() < this.getText().length)
      this.indexInText++;
    else
      return console.log("Cannot continue, reached end of text!");

    let word = this.stringHelper.getWordAt(this.getText(), this.getIndex());

    if (word.length > 2 && this.getText()[this.getIndex() - 1] == " ")
      this.reader.play(word, this.currentChapter.type)
    else
      this.reader.play(this.getCurrentChar(), this.currentChapter.type);
  }

  //index = 0;
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
