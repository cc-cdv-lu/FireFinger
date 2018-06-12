import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import * as MeSpeak from 'mespeak'


@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  meSpeak: MeSpeak;

  options = {
    amplitude: 100,
    pitch: 50,
    speed: 175, //words per minute
    //voice: 'defaultVoice',
    wordgap: 0,
    volume: 1,
    punct: true,
    capitals: 1
    //rawdata,
  };


  constructor(private electron: ElectronService) {

    // Init service
    this.meSpeak = window.require('mespeak');
    console.log("MeSpeak:", this.meSpeak)

    // Load config
    this.meSpeak.loadConfig(window.require('mespeak/src/mespeak_config.json'));

    // Load voice module (language)
    this.meSpeak.loadVoice(window.require('mespeak/voices/de.json'));

    // Make sure that no calls were queued before setup
    this.meSpeak.resetQueue();
  }

  play(str: string) {
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
      case "\n": return this.speak("Enter");
      case " ": return this.speak("Leerzeichen");

      //case ":": return this.speak("Doppelpunkt");
      //case ".": return this.speak("Punkt");
      //case ",": return this.speak(",");
      //case "?": return this.speak("Fragezeichen");
      //case "!": return this.speak("Ausrufezeichen");
      case "-": return this.speak("Bindestrich");
      //case "€": return this.speak("Euro-Zeichen");
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
