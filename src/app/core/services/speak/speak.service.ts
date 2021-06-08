/***
 * THOUGHTS AND PRAYERS
 * ScreenReader only works, if screenreader is enabled...
 * maybe use this instead
 * https://github.com/capacitor-community/text-to-speech
 * It also has muuuch more functionality

 * */
import { Injectable } from '@angular/core';

import { ScreenReader } from '@capacitor/screen-reader';
import { TextToSpeech, TTSOptions } from '@capacitor-community/text-to-speech';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class SpeakService {
  constructor(
    private translate: TranslateService,
    private configService: ConfigService
  ) {}

  checkScreenReaderEnabled = async () => {
    const { value } = await ScreenReader.isEnabled();

    alert('Voice over enabled? ' + value);
  };

  /**
   * This function will only work if a Screen Reader is currently active.
   * @param value What the
   * @param language
   */
  async say(value: string, language?: string) {
    language = language ? language : 'de';
    await ScreenReader.speak({ value, language });
  }

  /**
   * This function will also work if no Screen Reader is currently active
   * and has more customisation options
   * @param value What the
   * @param language
   */
  async sayTTS(text: string, lang?: string) {
    lang = lang ? lang : 'de';
    /* MOVE This to config/settings
    const { voices } = await TextToSpeech.getSupportedVoices();
    const langs = await TextToSpeech.getSupportedLanguages();
    console.log('Supported voices: ', voices);
    console.log('Supported langs: ', langs);
    */
    const config = this.configService.getTTS();
    const options: TTSOptions = { ...config, text, lang };
    await TextToSpeech.speak(options);
  }

  play(str: string, type: number) {
    if (!str || str.length === 0) {
      return;
    }
    /* Special case for letter lessons */
    if (type === 0) {
      return this.sayTTS(this.filterSpecialChars(str[0]));
    }

    if (!str) {
      return;
    }
    if (str.length === 1) {
      this.playChar(str);
    } else {
      this.playWord(str);
    }
  }

  playWord(str: string) {
    this.sayTTS(str);
  }

  playChar(str: string) {
    if (str.length > 1) {
      this.sayTTS(str);
    }

    // Check if letter is uppercase
    if (str !== str.toLowerCase()) {
      return this.sayTTS(this.translate.instant('special.major') + ' ' + str);
    }

    str = this.filterSpecialChars(str);

    this.sayTTS(str);
  }

  filterSpecialChars(char: string): string {
    switch (char) {
      case '\n':
        return this.translate.instant('special.enter');
      case ' ':
        return this.translate.instant('special.space');
      case '&':
        return this.translate.instant('special.and');
      case '€':
        return this.translate.instant('special.euro');
      case '-':
        return this.translate.instant('special.dash');
      case '✓':
        return this.translate.instant('special.eot');
      default:
        return char;
    }
  }
}
