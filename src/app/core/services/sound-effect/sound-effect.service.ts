import { Injectable } from '@angular/core';

export const SOUNDS = {
  // ERROR: 'assets/audio/effect/scratch.wav',
  ERROR: 'assets/audio/effect/pc_error.flac',
  CLICK: 'assets/audio/effect/scratch.wav',
  SUCCESS: 'assets/audio/effect/success.wav',
  FAILURE: 'assets/audio/effect/failure.mp3',
};

@Injectable({
  providedIn: 'root',
})
export class SoundEffectService {
  constructor() {}

  play(url: string) {
    // play sound
    const audio = new Audio(url);

    audio.load();
    audio
      .play()
      .catch(err => console.warn('Error while trying to play sound:\n' + err));
  }
}
