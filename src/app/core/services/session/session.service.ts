import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { StatisticsService } from '../statistics/statistics.service';
import { UserService } from '../user/user.service';
import { ElectronService } from '../electron/electron.service';
import {
  SoundEffectService,
  SOUNDS,
} from '../sound-effect/sound-effect.service';
import { StringHelperService } from '../string-helper/string-helper.service';
import { ReaderService } from '../reader/reader.service';
import { Lesson, Chapter, VIEW } from '../../types';

const LAST_SESSION_KEY = 'LAST_SESSION';
const DIFFICULTY_KEY = 'DIFFICULTY';

export const enum GAME_STATE {
  PLAYING,
  SUCCESS,
  FAILURE,
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  difficulty = {
    maxMistakePercentage: 5, // in percentage
    maxMistakeCount: 50, // as mistakes per session
    minTypeSpeed: 40, // as characters per minute
    playWinSound: true,
    playFailSound: false,
  };

  //
  gameState = GAME_STATE.PLAYING;

  private _isSessionLoaded = false;

  // Session data
  private indexInText = 0;
  last_wrong_char = '';

  private _currentLesson: Lesson;
  private _currentChapter: Chapter;
  private _currentIndex: number;

  constructor(
    private stats: StatisticsService,
    private router: Router,
    private user: UserService,
    private electron: ElectronService,
    private sound: SoundEffectService,
    private stringHelper: StringHelperService,
    public reader: ReaderService
  ) {
    // TODO set up a event system that should trigger the saving of this
    let store: any;
    if (this.electron.config) {
      store = this.electron.config.get(DIFFICULTY_KEY);
    }
    if (store) {
      this.difficulty = store;
    }
  }

  isSessionLoaded() {
    return this._isSessionLoaded;
  }

  getCurrentChapter() {
    return this._currentChapter;
  }

  focusInput() {
    const input = document.getElementById('inputLetter');
    console.log('User triggered input focus', input);
    input.setAttribute('tabindex', '1');
    input.focus();
  }

  onEndOfChapter(event) {
    // Log success relevant values
    const mistakeCount = this.stats.currentStats.mistakesCount;
    const mistakePercentage = this.stats.currentStats.mistakesCount;
    const typeSpeed = this.stats.currentStats.typeSpeed;

    // Calculating overall stats
    this.user.loggedInUser.lastSessionStats = this.stats.currentStats;
    this.user.loggedInUser.lastSessionStats.mistakePercentage = this.getMistakePercentageAsNumber();
    this.user.recalculateOverallStats();
    this.user.saveUserChanges();

    // Check if fast enough & didn't make to many mistakes
    if (
      mistakeCount <= this.difficulty.maxMistakeCount &&
      mistakePercentage <= this.difficulty.maxMistakePercentage &&
      typeSpeed >= this.difficulty.minTypeSpeed
    ) {
      this.onSuccess();
    } else {
      if (mistakeCount > this.difficulty.maxMistakeCount) {
        console.log('Too many mistakes');
      }
      if (mistakePercentage > this.difficulty.maxMistakePercentage) {
        console.log('Too high mistake percentage!');
      }
      if (typeSpeed < this.difficulty.minTypeSpeed) {
        console.log('Too slow!');
      }
      this.onFailure();
    }

    this.reset();
  }

  onSuccess() {
    this.nextChapter();
    console.log('BIG success! Next level coming up!');
    if (this.difficulty.playWinSound) {
      this.sound.play(SOUNDS.SUCCESS);
    }
    this.gameState = GAME_STATE.SUCCESS;
    this.router.navigateByUrl('summary');
  }

  onFailure() {
    console.log('Better luck next time');
    if (this.difficulty.playFailSound) {
      this.sound.play(SOUNDS.FAILURE);
    }
    this.gameState = GAME_STATE.FAILURE;
    this.router.navigateByUrl('summary');
  }

  reset() {
    this.indexInText = 0;
    this.stats.reset();
    this._isSessionLoaded = false;
    this.saveSession();
  }

  checkIfDone(): boolean {
    // What should happen when level is over
    if (this.getIndex() >= this.getText().length) {
      this.onEndOfChapter(event);
      return true;
    }
    return false;
  }

  getText() {
    if (!this._currentLesson) {
      return '';
    }
    if (!this.isSessionLoaded) {
      switch (this.gameState) {
        case GAME_STATE.SUCCESS:
          return '✌️';
        case GAME_STATE.FAILURE:
          return '👎';
        default:
          return 'Something went wrong...';
      }
    }

    return this._currentLesson.chapters[this._currentIndex].content;
  }

  getIndex() {
    if (!this.indexInText) {
      return 0;
    }
    return this.indexInText;
  }

  getExpectedKey(): string {
    return this.stringHelper.getCurrentChar(this.getText(), this.getIndex());
  }

  getCurrentWord(): string {
    return this.stringHelper.getWordAt(this.getText(), this.getIndex());
  }

  getMistakePercentageAsNumber() {
    if (!this.getText()) {
      return 0;
    }
    if (this.getText().length < 1) {
      return 0;
    }
    return Math.round(
      (this.stats.currentStats.mistakesCount / this.getText().length) * 100
    );
  }

  getMistakePercentage() {
    return this.getMistakePercentageAsNumber() + '%';
  }

  saveDifficulty() {
    this.electron.config.set(DIFFICULTY_KEY, this.difficulty);
    console.log('Saved difficulty settings:', this.difficulty);
  }

  saveSession() {
    const session = {
      lesson: this._currentLesson,
      chapter: this._currentChapter,
      index: this._currentIndex,
      indexInText: this.getIndex(),
      stats: this.stats.currentStats,
    };
    this.electron.config.set(LAST_SESSION_KEY, session);
    console.log('Saved last session:', session);
  }
  restoreSession() {
    let session: any;
    if (this.electron.config) {
      session = this.electron.config.get(LAST_SESSION_KEY);
    }
    if (!session) {
      this._isSessionLoaded = false;
      return console.log('No previous session was found...');
    }

    this._currentLesson = session.lesson;
    this._currentChapter = session.chapter;
    this._currentIndex = session.index;
    this.indexInText = session.indexInText ? session.indexInText : 0;
    if (session.stats) {
      this.stats.currentStats = session.stats;
      this.stats.adjustTimeAfterRestore();
    }
    this._isSessionLoaded = true;
    console.log('Loaded last session:', session);
  }

  loadSession(lesson: Lesson, index: number) {
    this.reset();
    this._currentLesson = lesson;
    this._currentChapter = lesson.chapters[index];
    this._currentIndex = index;
    this._isSessionLoaded = true;
    this.saveSession();
  }

  getPrevSegment(view: VIEW) {
    const str = this.getText();
    const index = this.getIndex();
    return this.stringHelper.getPrevSegment(str, index, view);
  }

  getNextSegment(view: VIEW) {
    const str = this.getText();
    const index = this.getIndex();
    return this.stringHelper.getNextSegment(str, index, view);
  }

  getCurrentChar() {
    const str = this.getText();
    const index = this.getIndex();
    return this.stringHelper.getCurrentChar(str, index);
  }

  nextTextIndex() {
    this.last_wrong_char = '';
    this.stats.checkSpeed();

    if (this.getIndex() < this.getText().length) {
      this.indexInText++;
    } else {
      return console.log('Cannot continue, reached end of text!');
    }

    const word = this.stringHelper.getWordAt(this.getText(), this.getIndex());

    if (word.length > 2 && this.getText()[this.getIndex() - 1] === ' ') {
      this.reader.play(word, this._currentChapter.type);
    } else {
      this.reader.play(this.getCurrentChar(), this._currentChapter.type);
    }
  }

  // index = 0;
  nextChapter() {
    if (!this._currentLesson) {
      return console.log('No lesson loaded...');
    }
    if (this._currentIndex < this._currentLesson.chapters.length - 1) {
      this.loadSession(this._currentLesson, this._currentIndex + 1);
    } else {
      // TODO reached end of chapters
      console.log('Reached end of lesson!');
    }
  }

  previousChapter() {
    if (this._currentIndex > 0) {
      this.loadSession(this._currentLesson, this._currentIndex - 1);
    } else {
      console.log('Reached beginning of lesson');
    }
  }
}
