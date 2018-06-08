import { Injectable } from '@angular/core';

import { StatisticsService, Statistics } from './statistics.service';
import { ColorScheme, StyleService } from './style.service';
import { ElectronService } from '../providers/electron.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedInUser: User;
  constructor(public electron: ElectronService) { }

  login(name: string) {

    // first try to find the user in the config
    this.loggedInUser = this.electron.config.get("USER_" + name);

    // if he is not present, log a new user
    if (!this.loggedInUser) {
      this.loggedInUser = new User();
      this.loggedInUser.name = name;
      console.log("Creating new user: " + name);
      this.electron.config.set("USER_" + name, this.loggedInUser);
    }

    console.log("Logged in as: " + this.loggedInUser.name);
    console.log("Detailed view:", this.loggedInUser);
  }

  saveUserChanges() {
    this.electron.config.set("USER_" + this.loggedInUser.name, this.loggedInUser);
    console.log("Saved user to storage:", this.electron.config.get("USER_" + this.loggedInUser.name));
  }

  recalculateOverallStats() {
    let sessionCount;
    //Totals
    this.loggedInUser.overallStats.mistakesCount = this.loggedInUser.overallStats.mistakesCount + this.loggedInUser.lastSessionStats.mistakesCount;
    if (this.loggedInUser.overallStats.sessionCount > 0) sessionCount = this.loggedInUser.overallStats.sessionCount;
    else sessionCount = 0;

    if (this.loggedInUser.lastSessionStats.mistakeKeys) { //Check if user has made any mistakes at all
      for (let mistake of this.loggedInUser.lastSessionStats.mistakeKeys) {
        let keyPair = this.findKeyPair(mistake.key, this.loggedInUser.overallStats.mistakeKeys);
        if (!keyPair) {
          keyPair = mistake;
          if (!this.loggedInUser.overallStats.mistakeKeys)
            this.loggedInUser.overallStats.mistakeKeys = [keyPair]
          else
            this.loggedInUser.overallStats.mistakeKeys.push(keyPair)
        }
        keyPair.count++;
      }
    }

    //Averages
    this.loggedInUser.overallStats.typeSpeed = (this.loggedInUser.overallStats.typeSpeed * sessionCount + this.loggedInUser.lastSessionStats.typeSpeed) / (sessionCount + 1);
    this.loggedInUser.overallStats.mistakePercentage = (this.loggedInUser.overallStats.mistakePercentage * sessionCount + this.loggedInUser.lastSessionStats.mistakePercentage) / (sessionCount + 1);


    this.loggedInUser.overallStats.sessionCount++;

  }

  private findKeyPair(key: string, arr) {
    if (!arr) return null;
    if (arr.length == 0) return null;
    for (let entry of arr) {
      if (entry.key == key) return entry;
    }
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

}
