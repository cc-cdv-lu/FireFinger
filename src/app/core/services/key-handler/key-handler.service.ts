import { Injectable } from '@angular/core';

import { SessionService } from '../session/session.service';
import { ReaderService } from '../reader/reader.service';
import {
  SoundEffectService,
  SOUNDS,
} from '../sound-effect/sound-effect.service';
import { StatisticsService } from '../statistics/statistics.service';
import { ChapterType } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class KeyHandlerService {
  constructor(
    private session: SessionService,
    private reader: ReaderService,
    private sound: SoundEffectService,
    private stats: StatisticsService
  ) {}

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
    'NumLock',
  ];

  impossibleKeys = ['´', '`', 'ß', '�'];

  shouldIgnore(key: string): boolean {
    /* If pressed key is part of the list, ignore it (return true)*/
    /* If it is not part of the list (indexOf = -1), true false */
    return this.ignoreKeys.includes(key);
  }

  isImpossible(key: string): boolean {
    // These are chars that require some buggy or unsupported key combinations
    return this.impossibleKeys.includes(key);
  }

  handleKeyEvent(event: KeyboardEvent) {
    // Pre-handle checks
    if (!this.session.isSessionLoaded) {
      return console.log('No session loaded...');
    }

    if (this.session.checkIfDone()) {
      return;
    }
    if (document.activeElement.id !== 'inputLetter') {
      return;
    }

    const pressedKey = event.key;
    const expectedKey = this.session.getCurrentChar();

    // Ignore special cases such as user trying to increase font size or starting to type special characters
    if (this.shouldIgnore(pressedKey) || event.altKey || event.ctrlKey) {
      return;
    }

    if (this.isImpossible(expectedKey)) {
      return this.session.nextTextIndex();
    }

    // console.log('PRESSED KEY:', pressedKey);

    if (
      this.session.getChapterType() === ChapterType.SIMPLE &&
      pressedKey.toLowerCase() === expectedKey
    ) {
      return this.session.nextTextIndex();
    }

    switch (pressedKey) {
      // Reset current session / restart current level
      case 'Escape': {
        return this.session.reset();
      }
      // play current char
      case 'ArrowDown': {
        return this.reader.play(
          this.session.getCurrentChar(),
          this.session.getCurrentChapter().type
        );
      }
      // play current word
      case 'ArrowRight': {
        return this.reader.play(this.session.getCurrentWord(), 2);
      }
      // do nothing
      case 'ArrowLeft':
      case 'ArrowUp': {
        return;
      }
      // Default case
      case expectedKey:
      case 'Pause': {
        return this.session.nextTextIndex();
      }
      // Special cases
      case 'Enter': {
        if (expectedKey === '\n') {
          return this.session.nextTextIndex();
        } else {
          break;
        }
      }
      // Handle apothrophies
      case '"': {
        if (expectedKey === '„' || expectedKey === '“') {
          return this.session.nextTextIndex();
        } else {
          break;
        }
      }
    }

    // If wrong letter was entered
    this.sound.play(SOUNDS.ERROR);
    if (pressedKey !== this.session.last_wrong_char) {
      console.log('Entered ' + pressedKey + ' instead of ' + expectedKey);
      this.session.last_wrong_char = pressedKey;
      this.stats.logMistakes(pressedKey, expectedKey);
      return;
    }
  }
}
