import { Injectable } from '@angular/core';
import { SessionService } from '../session/session.service';
import { StyleService } from '../style/style.service';
import { TranslateService } from '@ngx-translate/core';
import { ReaderService } from '../reader/reader.service';
import { SoundEffectService } from '../sound-effect/sound-effect.service';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  constructor(
    private session: SessionService,
    private style: StyleService,
    private translate: TranslateService,
    private reader: ReaderService,
    private sound: SoundEffectService
  ) {}

  /*
    View specific
  */

  getImageSource() {
    return this.getChapter().data.imageSRC;
  }

  isRecordingAvailable() {
    return this.getChapter().data.soundSRC !== undefined;
  }

  playRecording() {
    if (!this.isRecordingAvailable()) {
      return;
    }
    const url = this.getChapter().data.soundSRC;
    this.sound.play(url);
  }

  getCurrentWithHighlight() {
    const char = this.attemptHighlight(this.session.getCurrentChar());

    return char;
  }

  getSimpleContent() {
    let output = this.session.getPrevSegment();
    for (
      let i = 0;
      i <
      this.session.getCurrentChapter().amount -
        this.session.getPrevSegment().length;
      i++
    ) {
      output += ' _';
    }
    return output;
  }

  /*
    Accessibility
  */
  getVoiceLang() {
    return this.reader.config.voice_id;
  }

  getTextLang() {
    return this.translate.currentLang;
  }

  /* Shortcuts */
  getCurrentForBraille() {
    if (!this.session.getCurrentChar()) {
      return '';
    }
    // https://www.fileformat.info/info/unicode/char/2880/index.htm
    // Replace new line char with point-8 (Enter-Button on braille display)
    return this.session.getCurrentChar().replace('\n', '\u2880');
  }

  getAriaLabel() {
    return this.getCurrentForBraille() + this.session.getNextSegment();
  }

  /*
    Generic
  */

  getPrev() {
    return this.session.getPrevSegment();
  }

  getNext() {
    return this.session.getNextSegment();
  }

  getChapter() {
    return this.session.getCurrentChapter();
  }

  getTheme() {
    return this.style.theme;
  }

  getFontFamily() {
    return this.style.fontFamily;
  }

  shouldHideFocus() {
    return this.style.hide_focus;
  }

  shouldShowGuideline() {
    return this.style.show_guideline;
  }

  shouldFlash() {
    return this.session.last_wrong_char !== '' && this.style.warning_flash;
  }

  isInFocus(): boolean {
    return document.activeElement.id === 'inputLetter';
  }

  attemptHighlight(char: string) {
    // reached end of chapter
    if (char === undefined) {
      return '✓';
    }
    if (!char) {
      return;
    }
    if (char.length > 1) {
      return '';
    }
    if (char === ' ') {
      return '_';
    }
    // reached end of line
    if (char === '\n') {
      return '↲';
    }
    return char;
  }

  getWarningText() {
    let output = '';
    if (!this.session) {
      return output;
    }
    const c: string = this.session.getCurrentChar();
    if (!c) {
      return output;
    }
    switch (c) {
      case '\n':
        return this.translate.instant('keys.enter');
      case ' ':
        return this.translate.instant('keys.space');
      // tslint:disable-next-line:quotemark
      case "'":
        return this.translate.instant('keys.apostrophe');
      case 'ä':
      case 'Ä':
      case 'ü':
      case 'Ü':
      case 'ö':
      case 'Ö':
        output += this.translate.instant('keys.umlaut');
    }
  }
}
