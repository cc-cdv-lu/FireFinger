import { EventEmitter, Injectable, Output } from '@angular/core';
import { Plugins } from '@capacitor/core';
const LAST_USER = 'ff_last_user';
const USER_LIST = 'ff_user_list';

const { Storage } = Plugins;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  @Output() onUserChange = new EventEmitter<string>();
  public username = undefined;
  public userlist: Array<string> = [];
  constructor() {}

  login(username: string) {
    if (!username) {
      console.warn('Undefined user tried to login');
      return;
    }
    this.onUserChange.emit(username);
    this.username = username;
    console.log(username, 'seems to be logged in');
    Storage.set({ key: LAST_USER, value: this.username });
    this.addNewUser(username);
  }

  prepare() {
    this.getUserlist().then((ul) => (this.userlist = ul));
    Storage.get({ key: LAST_USER }).then((user) => {
      console.log('last thingy:', user);
      if (
        user &&
        user.value &&
        user.value !== 'null' &&
        user.value !== 'undefined'
      ) {
        this.login(user.value);
        console.log('Loading config for previous user.', user);
      } else {
        console.log('There is noone to login...');
      }
    });
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
