import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService } from '../electron/electron.service';
import { StatisticsService } from '../statistics/statistics.service';
import { UserService } from '../user/user.service';
import { StringHelperService } from '../string-helper/string-helper.service';
import { ReaderService } from '../reader/reader.service';
import {
  SoundEffectService,
  SOUNDS,
} from '../sound-effect/sound-effect.service';

import { Lesson, Chapter, VIEW } from '../../type.service';

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

  isSessionLoaded = false;

  // Session data
  private indexInText = 0;
  last_wrong_char = '';

  currentLesson: Lesson;
  currentChapter: Chapter;
  currentIndex: number;

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

  ignoreKeys = [
    'ContextMenu',
    'CapsLock',
    'Tab',
    'Insert',
    'Home',
    'PageUp',
    'PageDown',
    'Delete',
    'End',
    'Backspace',
    'Shift',
    'Control',
    'Alt',
    'AltGraph',
    'Meta',
    'Dead',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
  ];

  impossibleKeys = ['´', '`', 'ß'];

  shouldIgnore(key: string): boolean {
    /* If pressed key is part of the list, ignore it (return true)*/
    /* If it is not part of the list (indexOf = -1), true false */
    return this.ignoreKeys.includes(key);
  }

  isImpossible(key: string) {
    // These are chars that require some buggy key combinations that are not recognized at the moment
    return this.impossibleKeys.includes(key);
  }

  focusInput() {
    const input = document.getElementById('inputLetter');
    console.log('User triggered input focus', input);
    input.setAttribute('tabindex', '1');
    input.focus();
  }

  handleKeyEvent(event: KeyboardEvent) {
    if (!this.isSessionLoaded) {
      return console.log('No session loaded...');
    }

    if (event.key === 'X' && event.shiftKey && event.ctrlKey) {
      this.focusInput();
      return;
    }

    // What should happen when level is over
    if (this.getIndex() >= this.getText().length) {
      return this.onEndOfChapter(event);
    }

    // Handle special keys
    const pressedKey = event.key;
    const expectedKey = this.stringHelper.getCurrentChar(
      this.getText(),
      this.getIndex()
    );
    // console.log('Expected vs pressed:', pressedKey, expectedKey);
    // console.log('Key Event:', event);
    if (pressedKey === 'Escape') {
      return this.reset();
    }
    if (document.activeElement.id !== 'inputLetter') {
      return;
    }
    if (this.shouldIgnore(pressedKey) || event.altKey) {
      return;
    }

    if (pressedKey === 'ArrowDown') {
      return this.reader.play(this.getCurrentChar(), this.currentChapter.type);
    } // play current char
    if (pressedKey === 'ArrowRight') {
      return this.reader.play(
        this.stringHelper.getWordAt(this.getText(), this.getIndex()),
        2
      );
    } // play current word
    if (pressedKey === 'ArrowLeft') {
      return;
    }
    if (pressedKey === 'ArrowUp') {
      return;
    }

    // Default case
    if (
      pressedKey === this.getCurrentChar() ||
      pressedKey === 'Pause' ||
      this.isImpossible(expectedKey)
    ) {
      return this.nextTextIndex();
    }
    // Special cases
    if (pressedKey === 'Enter' && this.getCurrentChar() === '\n') {
      return this.nextTextIndex();
    }

    if (this.getCurrentChar() === '�') {
      return this.nextTextIndex();
    }

    if (
      pressedKey === '"' &&
      (this.getCurrentChar() === '„' || this.getCurrentChar() === '“')
    ) {
      return this.nextTextIndex();
    }
    if (event.ctrlKey) {
      // Ignore special cases such as user trying to increase font size or typing special characters
      return;
    }

    // If wrong letter was entered
    this.sound.play(SOUNDS.ERROR);
    if (pressedKey !== this.last_wrong_char) {
      console.log('Entered ' + pressedKey + ' instead of ' + expectedKey);
      this.last_wrong_char = pressedKey;
      this.stats.logMistakes(pressedKey, expectedKey);
      return;
    }
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
    this.isSessionLoaded = false;
  }

  getText() {
    if (!this.currentLesson) {
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

    return this.currentLesson.chapters[this.currentIndex].content;
  }

  getIndex() {
    if (!this.indexInText) {
      return 0;
    }
    return this.indexInText;
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
      lesson: this.currentLesson,
      chapter: this.currentChapter,
      index: this.currentIndex,
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
      this.isSessionLoaded = false;
      return console.log('No previous session was found...');
    }

    this.currentLesson = session.lesson;
    this.currentChapter = session.chapter;
    this.currentIndex = session.index;
    this.indexInText = session.indexInText ? session.indexInText : 0;
    if (session.stats) {
      this.stats.currentStats = session.stats;
    }
    this.isSessionLoaded = true;
    console.log('Loaded last session:', session);
  }

  loadSession(lesson: Lesson, index: number) {
    this.reset();
    this.currentLesson = lesson;
    this.currentChapter = lesson.chapters[index];
    this.currentIndex = index;
    this.isSessionLoaded = true;
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
      this.reader.play(word, this.currentChapter.type);
    } else {
      this.reader.play(this.getCurrentChar(), this.currentChapter.type);
    }
  }

  // index = 0;
  nextChapter() {
    if (!this.currentLesson) {
      return console.log('No lesson loaded...');
    }
    if (this.currentIndex < this.currentLesson.chapters.length - 1) {
      this.loadSession(this.currentLesson, this.currentIndex + 1);
    } else {
      // TODO reached end of chapters
      console.log('Reached end of lesson!');
    }
  }

  previousChapter() {
    if (this.currentIndex > 0) {
      this.loadSession(this.currentLesson, this.currentIndex - 1);
    } else {
      console.log('Reached beginning of lesson');
    }
  }
}
