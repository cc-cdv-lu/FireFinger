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

  //* TODO this is not working correctly CPM should be much higher *//
  //* Possibly also log other stats such as: per character, how long does it take the user to type the letter, from when it is displayed on the screen //
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

    this.currentStats = new Statistics();
  }

  logMistakes(pressedKey: string, expectedKey: string) {
    switch (expectedKey) {
      case ' ': expectedKey = "Space"; break;
      case '\n': expectedKey = 'Enter'; break;
      default: break;
    }
    this.currentStats.mistakesCount++;
    if (!this.currentStats.mistakeKeys) {
      this.currentStats.mistakeKeys = [{ key: expectedKey, count: 0 }]
    }
    let obj = this.getMatchingObject(this.currentStats.mistakeKeys, 'key', expectedKey);
    if (obj == null) {
      obj = { key: expectedKey, count: 0 }
      this.currentStats.mistakeKeys.push(obj);
    }
    obj.count++;
  }

  getMatchingObject(arr: Array<any>, identifier: string, query: string) {
    for (let o of arr) {
      if (o[identifier] == query) return o;
    }
  }

  getTopMistakes(stats: Statistics, amount: number) {
    if (!stats.mistakeKeys) return [];
    let sortedArray = stats.mistakeKeys.sort((a, b) => {
      return b.count - a.count;
    });
    console.log("Sortedarray", sortedArray);
    let output = [];
    for (let i = 0; i < amount; i++) {
      if (sortedArray[i])
        output.push(sortedArray[i])
    }

    return output;


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
