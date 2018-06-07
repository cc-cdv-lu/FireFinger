import { Injectable } from '@angular/core';

import { StatisticsService, Statistics } from './statistics.service';
import { ColorScheme, StyleService } from './style.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedInUser: User;
  constructor() {
    let user: User = new User;
    user.name = "default Test";
    //TODO load last user from config
    if (this.loggedInUser == null) {
      // find a way to trigger login screen - maybe dialog
      this.loggedInUser = user;
    }

  }

  login(user: User) {
    this.loggedInUser = user;
    //TODO save to config
  }

}

export class User {
  name: string = "";
  lastSessionStats: Statistics = new Statistics();
  overallStats: Statistics = new Statistics();
  preferedColorScheme: ColorScheme;
  preferedFont: number;
  constructor() {
  }


  recalculateOverallStats() {
    let sessionCount;
    if (this.overallStats.sessionCount > 0) sessionCount = this.overallStats.sessionCount;
    else sessionCount = 0;

    this.overallStats.typeSpeed = this.overallStats.typeSpeed * sessionCount + this.lastSessionStats.typeSpeed;
    this.overallStats.mistakePercentage = this.overallStats.mistakePercentage * sessionCount + this.lastSessionStats.mistakePercentage;
    for (let i = 0; i < this.overallStats.mistakeKeys.length; i++) {
      this.overallStats.mistakeKeys[i].count = this.overallStats.mistakeKeys[i].count * sessionCount + this.findKeyPair(this.overallStats.mistakeKeys[i].key, this.lastSessionStats.mistakeKeys).count;
    }

    this.overallStats.sessionCount++;

  }

  private findKeyPair(key: string, arr) {
    for (let entry of arr) {
      if (entry.key == key) return entry;
    }
  }
}
