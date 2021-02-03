import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from '../electron/electron.service';

import * as MeSpeak from 'mespeak';
import * as FS from 'fs-extra';
import * as path from 'path';
import { CONFIG } from '../config/config.service';

const READER_CONFIG_KEY = 'READER_CONFIG';

/**
 * This service is responsible for reading out loud certain strings
 */

@Injectable({
  providedIn: 'root',
})
export class ReaderService {
  voices = [
    {
      description: 'English',
      url: 'en/en.json',
      id: 'en',
    },
    {
      description: 'German',
      url: 'de.json',
      id: 'de',
    },
    {
      description: 'French',
      url: 'fr.json',
      id: 'fr',
    },
    {
      description: 'Portugees',
      url: 'pt.json',
      id: 'pt',
    },
    {
      description: 'Spanish',
      url: 'es.json',
      id: 'es',
    },
    {
      description: 'Italian',
      url: 'it.json',
      id: 'it',
    },
  ];

  variants = [
    {
      id: 'f1',
      description: 'Female 1',
    },
    {
      id: 'f2',
      description: 'Female 2',
    },
    {
      id: 'f3',
      description: 'Female 3',
    },
    {
      id: 'f4',
      description: 'Female 4',
    },
    {
      id: 'f5',
      description: 'Female 5',
    },
    {
      id: 'm1',
      description: 'Male 1',
    },
    {
      id: 'm2',
      description: 'Male 2',
    },
    {
      id: 'm3',
      description: 'Male 3',
    },
    {
      id: 'm4',
      description: 'Male 4',
    },
    {
      id: 'm5',
      description: 'Male 5',
    },
    {
      id: 'm6',
      description: 'Male 6',
    },
    {
      id: 'm7',
      description: 'Male 7',
    },
    {
      id: 'croak',
      description: 'Croak',
    },
    {
      id: 'klatt',
      description: 'klatt',
    },
    {
      id: 'klatt2',
      description: 'klatt2',
    },
    {
      id: 'klatt3',
      description: 'klatt3',
    },
    {
      id: 'whisper',
      description: 'Whisper',
    },
    {
      id: 'whisperf',
      description: 'Whisperf',
    },
  ];

  private meSpeak: MeSpeak;
  private configURL: string;
  private voiceURLBase: string;

  config = {
    voice: this.voices[1].url,
    voice_id: this.voices[1].id,
    test: 'Das ist ein Test!',
    options: {
      amplitude: 100,
      pitch: 50,
      speed: 175, // words per minute
      // voice: 'defaultVoice',
      wordgap: 0,
      volume: 1,
      punct: true,
      capitals: 1,
      variant: this.variants[2].id,
    },
  };

  constructor(
    private electron: ElectronService,
    private translate: TranslateService
  ) {
    if (this.electron.isDev()) {
      this.configURL = path.join(
        this.electron.app.getAppPath(),
        'src/assets/mespeak/mespeak_config.json'
      );
      this.voiceURLBase = path.join(
        this.electron.app.getAppPath(),
        'src/assets/mespeak/voices'
      );
    } else {
      this.configURL = path.join(
        this.electron.app.getAppPath(),
        'dist/assets/mespeak/mespeak_config.json'
      );
      this.voiceURLBase = path.join(
        this.electron.app.getAppPath(),
        'dist/assets/mespeak/voices'
      );
    }

    // Restore options from last session if available
    this.restore();

    // Init service
    this.meSpeak = MeSpeak;

    // Load config
    this.meSpeak.loadConfig(FS.readJsonSync(this.configURL));

    // Load voice module (language)
    this.loadVoice(this.config.voice);

    // Make sure that no calls were queued before setup
    this.meSpeak.resetQueue();
  }

  loadVoice(voice_url: string) {
    const url = path.join(this.voiceURLBase, voice_url);
    this.meSpeak.loadVoice(FS.readJsonSync(url));
  }

  play(str: string, type: number) {
    if (!str || str.length === 0) {
      return;
    }
    /* Special case for letter lessons */
    if (type === 0) {
      return this.speak(this.filterSpecialChars(str[0]));
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
    this.speak(str);
  }

  playChar(str: string) {
    if (str.length > 1) {
      this.speak(str);
    }

    // Check if letter is uppercase
    if (str !== str.toLowerCase()) {
      return this.speak(this.translate.instant('special.major') + ' ' + str);
    }

    str = this.filterSpecialChars(str);

    this.speak(str);
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

  private speak(str: string) {
    if (!this.meSpeak.canPlay()) {
      return console.error('Cannot play at the moment...');
    }
    try {
      this.meSpeak.speak(str, this.config.options);
    } catch (err) {
      console.error('Unexpected error while trying to play character: ', err);
    }
  }

  stopAllPlayback() {
    this.meSpeak.resetQueue();
  }

  save() {
    console.log('Saving config...', this.config);
    this.electron.config.set(READER_CONFIG_KEY, this.config);
  }

  restore() {
    if (!this.electron.config) {
      console.log('Config is not working...');
      return;
    }
    const opt = this.electron.config.get(READER_CONFIG_KEY);
    if (opt) {
      this.config = opt;
    }
  }
}
