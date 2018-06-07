import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  iLastTime = 0;
  iTime = 0;
  iTotal = 0;
  iKeys = 0;

  cpm = 0;
  wpm = 0;
  checkSpeed() {
    this.iTime = new Date().getTime();

    if (this.iLastTime != 0) {
      this.iKeys++;
      this.iTotal += this.iTime - this.iLastTime;
      this.cpm = Math.round(this.iKeys / this.iTotal * 6000);
    }

    this.iLastTime = this.iTime;
  }

  reset() {
    this.iLastTime = 0;
    this.iTime = 0;
    this.iTotal = 0;
    this.iKeys = 0;

    this.cpm = 0;
    this.wpm = 0;
  }

  logMistakes(pressedKey: string, expectedKey: string) {
    //STUB TODO
  }

}

export class Statistics {

}
