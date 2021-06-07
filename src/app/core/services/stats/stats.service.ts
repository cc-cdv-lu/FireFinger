/***
 * THOUGHTS AND PRAYERS
 *
 * Check contents of bla
 * Don't register same mistake twice in a row
 *
 */

import { Injectable } from '@angular/core';
import { LessonStats } from '@app/core/data.types';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  stats: LessonStats;
  timer: any;

  /*Note: Text length is effectivly equal to successcount */

  constructor() {
    this.reset();
  }

  reset() {
    this.stats = {
      mistakes: 0,
      time: 0,
      length: 0,
      rating: 0,
    };
  }

  startTimer() {
    if(this.timer) return;
    this.timer = setInterval(() => {
      this.stats.time += 10;
    }, 10);
  }
  pauseTimer() {
    clearInterval(this.timer);
  }
  resetTimer() {
    clearInterval(this.timer);
    this.stats.time = 0;
  }
  getTimer(): number {
    return this.stats.time;
  }

  registerMistake(bla: any) {
    console.log('Mistake registered.', bla);
    this.stats.mistakes++;
  }
  registerSuccess(bla: any) {
    console.log('Success registered.', bla);
    this.stats.length++;
  }

  getMistakeCount(): number {
    return this.stats.mistakes;
  }

  getMistakeRatio(): number {
    const sum = this.stats.mistakes + this.stats.length;
    if (sum > 0) {
      return this.stats.mistakes / sum;
    } else {
      return 0;
    }
  }
}
