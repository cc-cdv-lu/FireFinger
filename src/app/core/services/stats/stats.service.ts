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
  successCount = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.successCount = 0;
    this.stats = {
      mistakes: 0,
      time: 0,
      length: 0,
      rating: 0,
    };
  }

  startTimer() {}
  pauseTimer() {}
  endTimer() {}
  resetTimer() {}

  registerMistake(bla: any) {
    console.log('Mistake registered.', bla);
    this.stats.mistakes++;
  }
  registerSuccess(bla: any) {
    console.log('Success registered.', bla);
    this.successCount++;
  }

  getMistakeCount(): number {
    return this.stats.mistakes;
  }

  getMistakeRatio(): number {
    const sum = this.stats.mistakes + this.successCount;
    if (sum > 0) {
      return this.stats.mistakes / sum;
    } else {
      return 0;
    }
  }
}
