import { Injectable } from '@angular/core';

import { ScreenReader } from '@capacitor/screen-reader';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root',
})
export class SpeakService {
  constructor() {}

  // ScreenReader only works, if screenreader is enabled...
  // maybe use this instead
  // https://github.com/capacitor-community/text-to-speech
  // It also has muuuch more functionality

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

  async sayTTS(text: string, lang?: string) {
    lang = lang ? lang : 'de';
    const { voices } = await TextToSpeech.getSupportedVoices();
    const langs = await TextToSpeech.getSupportedLanguages();
    console.log('Supported voices: ', voices);
    console.log('Supported langs: ', langs);
    const voice = 0;
    await TextToSpeech.speak({
      text,
      lang,
      category: 'ambient',
      pitch: 2.0,
      rate: 0.4,
      volume: 1.0,
      voice,
    });
  }
}
