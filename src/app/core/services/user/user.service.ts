import { EventEmitter, Injectable, Output } from '@angular/core';
import { Plugins } from '@capacitor/core';
const LAST_USER = 'last_user';
const USER_LIST = 'user_list';

const { Storage } = Plugins;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  @Output() onUserChange = new EventEmitter<string>();
  public username = '(NO NAME)';
  public userlist: Array<string> = [];
  constructor() {}

  login(username: string) {
    this.onUserChange.emit(username);
  }

  prepare() {
    this.onUserChange.subscribe((username) => {
      this.username = username;
      Storage.set({ key: LAST_USER, value: this.username });
      this.addNewUser(username);
    });

    Storage.get({ key: LAST_USER }).then((user) => {
      if (user && user.value !== 'null') {
        this.login(user.value);
        console.log('Loading config for previous user.', user);
      } else {
        this.login('(NO NAME)');
      }
    });

    this.getUserlist().then((ul) => (this.userlist = ul));
  }

  async getUserlist(): Promise<Array<string>> {
    const list = await Storage.get({ key: USER_LIST });
    const obj = JSON.parse(list.value);
    if (obj && obj?.users !== null) {
      return JSON.parse(list.value).users;
    } else {
      return [];
    }
  }

  async addNewUser(username: string) {
    const userlist = await this.getUserlist();
    if (
      !userlist.includes(username) &&
      username !== '(NO NAME)' &&
      username !== 'null'
    ) {
      this.userlist.push(username);
    }
    Storage.set({
      key: USER_LIST,
      value: JSON.stringify({ users: this.userlist }),
    });
  }
}
