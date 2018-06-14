import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import * as MeSpeak from 'mespeak';

const READER_CONFIG_KEY = "READER_CONFIG";

@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  voices = [
    {
      description: 'German',
      url: 'mespeak/voices/de.json'
    },
    {
      description: 'French',
      url: 'mespeak/voices/fr.json'
    }
  ]

  variants = [
    {
      id: "f1",
      description: "Female 1"
    },
    {
      id: "f2",
      description: "Female 2"
    },
    {
      id: "f3",
      description: "Female 3"
    },
    {
      id: "f4",
      description: "Female 4"
    },
    {
      id: "f5",
      description: "Female 5"
    },
    {
      id: "m1",
      description: "Male 1"
    },
    {
      id: "m2",
      description: "Male 2"
    },
    {
      id: "m3",
      description: "Male 3"
    },
    {
      id: "m4",
      description: "Male 4"
    },
    {
      id: "m5",
      description: "Male 5"
    },
    {
      id: "m6",
      description: "Male 6"
    },
    {
      id: "m7",
      description: "Male m7"
    },
    {
      id: "croak",
      description: "Croak"
    },
    {
      id: "klatt",
      description: "klatt"
    },
    {
      id: "klatt2",
      description: "klatt2"
    },
    {
      id: "klatt3",
      description: "klatt3"
    },
    {
      id: "whisper",
      description: "Whisper"
    },
    {
      id: "whisperf",
      description: "Whisperf"
    },
  ]

  private meSpeak: MeSpeak;

  config = {
    voice: this.voices[0].url,
    test: 'Das ist ein Test!',
    options: {
      amplitude: 100,
      pitch: 50,
      speed: 175, //words per minute
      //voice: 'defaultVoice',
      wordgap: 0,
      volume: 1,
      punct: true,
      capitals: 1,
      variant: this.variants[2].id
    }
  }


  constructor(private electron: ElectronService) {

    // Restore options from last session if available
    //this.restore();

    // Init service
    this.meSpeak = window.require('mespeak');

    // Load config
    this.meSpeak.loadConfig(window.require('mespeak/src/mespeak_config.json'));

    // Load voice module (language)
    this.loadVoice(this.config.voice)

    // Make sure that no calls were queued before setup
    this.meSpeak.resetQueue();
  }

  loadVoice(voice_url) {
    this.meSpeak.loadVoice(window.require(voice_url));
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
      this.meSpeak.speak(str, this.config.options)
    }
    catch (err) {
      this.meSpeak.recoverFromFSError("[" + this.counter + "] Trying to read: " + str)
      console.error("Unexpected error while trying to play character: ", err)
    }
  }

  stopAllPlayback() {
    this.meSpeak.resetQueue();
  }

  save() {
    this.electron.config.set(READER_CONFIG_KEY, this.config)
  }

  restore() {
    let opt = this.electron.config.get(READER_CONFIG_KEY);
    if (opt) this.config = opt;
  }

}
