import { EventEmitter, Injectable, Output } from '@angular/core';
import { Stats } from '../stats/stats.service';

export type User = {
  stats: Stats;
};

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  @Output() onUserChange = new EventEmitter<User>();
  constructor() {}
}
