import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  mistakeCount = 0;
  successCount = 0;

  /*
   * Check contents of bla
   * Don't register same mistake twice in a row
   */

  constructor() {}

  reset() {
    this.mistakeCount = 0;
    this.successCount = 0;
  }

  registerMistake(bla: any) {
    console.log('Mistake registered.', bla);
    this.mistakeCount++;
  }
  registerSuccess(bla: any) {
    console.log('Success registered.', bla);
    this.successCount++;
  }

  getMistakeCount(): number {
    return this.mistakeCount;
  }

  getMistakeRatio(): number {
    const sum = this.mistakeCount + this.successCount;
    if (sum > 0) {
      return this.mistakeCount / sum;
    } else {
      return 0;
    }
  }
}
