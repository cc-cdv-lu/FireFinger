import { Injectable } from '@angular/core';

export var SOUNDS = {
  //ERROR: 'assets/audio/effect/scratch.wav',
  ERROR: 'assets/audio/effect/pc_error.flac',
  CLICK: 'assets/audio/effect/scratch.wav',
  SUCCESS: 'assets/audio/effect/success.wav',
  FAILURE: 'assets/audio/effect/failure.mp3'
}

@Injectable({
  providedIn: 'root'
})
export class SoundEffectService {

  constructor() { }

  play(url: string) {
    //play sound
    let audio = new Audio();
    audio.src = url;

    audio.load();
    audio.play();
  }
}
