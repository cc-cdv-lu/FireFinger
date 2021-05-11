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
    this.username = username;
    Storage.set({ key: LAST_USER, value: this.username });
    this.addNewUser(username);
  }

  prepare() {
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
    console.log('Got:', obj?.users);
    if (obj && obj?.users) {
      return obj.users;
    } else {
      return [];
    }
  }

  async addNewUser(username: string) {
    const userlist = await this.getUserlist();
    if (
      !userlist.includes(username) &&
      username !== '(NO NAME)' &&
      username !== 'null' &&
      username !== 'undefined' &&
      username
    ) {
      this.userlist.push(username);
    }
    Storage.set({
      key: USER_LIST,
      value: JSON.stringify({ users: this.userlist }),
    });
    console.log('Tried adding new user:', this.userlist);
  }
}
