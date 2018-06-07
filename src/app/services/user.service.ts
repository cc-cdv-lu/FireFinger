import { Injectable } from '@angular/core';

import { StatisticsService, Statistics } from './statistics.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedInUser: User;
  constructor() {
    //TODO load last user from config
    if (this.loggedInUser == null) {
      // find a way to trigger login screen - maybe dialog
    }

  }

  login(user: User) {
    this.loggedInUser = user;
    //TODO save to config
  }
}

export class User {
  name: string;
  stats: Statistics;
  constructor() {
  }
}
