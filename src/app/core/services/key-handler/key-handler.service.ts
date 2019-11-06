import { Injectable } from '@angular/core';

import { SessionService } from '../session/session.service';
import { ReaderService } from '../reader/reader.service';
import {
  SoundEffectService,
  SOUNDS,
} from '../sound-effect/sound-effect.service';
import { StatisticsService } from '../statistics/statistics.service';

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
  ];

  impossibleKeys = ['´', '`', 'ß', '�'];

  shouldIgnore(key: string): boolean {
    /* If pressed key is part of the list, ignore it (return true)*/
    /* If it is not part of the list (indexOf = -1), true false */
    return this.ignoreKeys.includes(key);
  }

  isImpossible(key: string): boolean {
    // These are chars that require some buggy key combinations that are not recognized at the moment
    return this.impossibleKeys.includes(key);
  }

  handleKeyEvent(event: KeyboardEvent) {
    if (!this.session.isSessionLoaded) {
      return console.log('No session loaded...');
    }

    if (this.session.checkIfDone()) {
      return;
    }

    // Handle special keys
    const pressedKey = event.key;
    const expectedKey = this.session.getCurrentChar();

    // console.log('Expected vs pressed:', pressedKey, expectedKey);
    // console.log('Key Event:', event);
    if (pressedKey === 'Escape') {
      return this.session.reset();
    }
    if (document.activeElement.id !== 'inputLetter') {
      return;
    }
    if (this.shouldIgnore(pressedKey) || event.altKey) {
      return;
    }

    switch (pressedKey) {
      case 'ArrowDown': {
        // play current char
        return this.reader.play(
          this.session.getCurrentChar(),
          this.session.getCurrentChapter().type
        );
      }
      case 'ArrowRight': {
        // play current word
        return this.reader.play(this.session.getCurrentWord(), 2);
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        // do nothing
        return;
      }
    }

    // Default case
    if (
      pressedKey === expectedKey ||
      pressedKey === 'Pause' ||
      this.isImpossible(expectedKey)
    ) {
      return this.session.nextTextIndex();
    }
    // Special cases
    if (pressedKey === 'Enter' && expectedKey === '\n') {
      return this.session.nextTextIndex();
    }

    if (pressedKey === '"' && (expectedKey === '„' || expectedKey === '“')) {
      return this.session.nextTextIndex();
    }
    if (event.ctrlKey) {
      // Ignore special cases such as user trying to increase font size or typing special characters
      return;
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
