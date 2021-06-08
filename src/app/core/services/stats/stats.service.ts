/***
 * THOUGHTS AND PRAYERS
 * To Do:
 * Errors per letter
 * Errors per finger?
 * Don't register same mistake twice in a row
 *
 */

import { Injectable } from '@angular/core';
import { LessonStats, Typing } from '@app/core/data.types';

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

  /**
   * Starts or resumes the timer
   */
  startTimer() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.stats.time += 10;
    }, 10);
  }
  /**
   * Pauses the timer. Call startTimer() to resume it
   */
  pauseTimer() {
    clearInterval(this.timer);
  }
  /**
   * Resets the timer back to zero
   */
  resetTimer() {
    clearInterval(this.timer);
    this.stats.time = 0;
  }
  /**
   * @returns the timers current time in milliseconds
   */
  getTimer(): number {
    return this.stats.time;
  }

  registerMistake(typing: Typing) {
    console.log('Mistake registered.', typing);
    this.stats.mistakes++;
  }
  registerSuccess(typing: Typing) {
    console.log('Success registered.', typing);
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
