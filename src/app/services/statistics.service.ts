import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  private iLastTime = 0;
  private iTime = 0;
  private iTotal = 0;
  private iKeys = 0;

  currentStats: Statistics = new Statistics();

  wpm = 0;
  checkSpeed() {
    this.iTime = new Date().getTime();

    if (this.iLastTime != 0) {
      this.iKeys++;
      this.iTotal += this.iTime - this.iLastTime;
      this.currentStats.typeSpeed = Math.round(this.iKeys / this.iTotal * 6000);
    }

    this.iLastTime = this.iTime;
  }

  reset() {
    this.iLastTime = 0;
    this.iTime = 0;
    this.iTotal = 0;
    this.iKeys = 0;

    this.wpm = 0;
  }

  logMistakes(pressedKey: string, expectedKey: string) {
    this.currentStats.mistakesCount++;
    //STUB TODO
  }


}

export class Statistics {
  sessionCount: number = 0;
  typeSpeed: number = 0;
  mistakePercentage: number = 0;
  mistakesCount: number = 0;
  mistakeKeys: [{
    key: string,
    count: number
  }];
  constructor() { }
}
