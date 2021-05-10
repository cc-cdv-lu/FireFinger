import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  @Output() onUserChange = new EventEmitter<string>();
  constructor() {}

  login(username: string) {
    this.onUserChange.emit(username);
  }
}
