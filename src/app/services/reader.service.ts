import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import * as MeSpeak from 'mespeak';

export var VOICES = {
  DE: 'mespeak/voices/de.json',
  FR: 'mespeak/voices/fr.json'
}

@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  variants = [
    "f1", "f2", "f3", "f4", "f5",
    "m1", "m2", "m3", "m4", "m5", "m6", "m7",
    "croak", "klatt", "klatt2", "klatt3", "whisper", "whisperf"
  ]

  private meSpeak: MeSpeak;

  //TODO try to load this from config
  options = {
    amplitude: 100,
    pitch: 50,
    speed: 175, //words per minute
    //voice: 'defaultVoice',
    wordgap: 0,
    volume: 1,
    punct: true,
    capitals: 1,
    variant: this.variants[2]
  };


  constructor(private electron: ElectronService) {

    // Init service
    this.meSpeak = window.require('mespeak');

    // Load config
    this.meSpeak.loadConfig(window.require('mespeak/src/mespeak_config.json'));

    // Load voice module (language)
    this.meSpeak.loadVoice(window.require(VOICES.DE));

    // Make sure that no calls were queued before setup
    this.meSpeak.resetQueue();
  }

  play(str: string) {
    if (!str) return;
    if (str.length == 1) this.playChar(str);
    else this.playWord(str);
  }

  playWord(str: string) {
    this.speak(str);
  }

  playChar(str: string) {
    if (str.length > 1) this.speak(str);

    // Check if letter is uppercase
    if (str != str.toLowerCase())
      return this.speak("Großes " + str);

    switch (str) {
      case "\n": return this.speak("eingabe");
      case " ": return this.speak("leerzeichen");
      case "&": return this.speak("undzeichen");
      case "€": return this.speak("euro zeichen");
      case "-": return this.speak("bindestrich");
      default: {
        this.speak(str);
      }
    }
  }
  counter = 0;
  private speak(str: string) {
    this.counter++;
    //console.log("Current counter:" + this.counter);

    if (this.counter > 70) {
      this.meSpeak.recoverFromFSError("Preamptive reset...");
      this.counter = 0;
    }

    if (!this.meSpeak.canPlay()) return console.error("Cannot play at the moment...");
    try {
      this.meSpeak.speak(str, this.options)
    }
    catch (err) {
      this.meSpeak.recoverFromFSError("[" + this.counter + "] Trying to read: " + str)
      console.error("Unexpected error while trying to play character: ", err)
    }
  }

  stopAllPlayback() {
    this.meSpeak.resetQueue();
  }

}
