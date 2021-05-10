import { Component } from '@angular/core';
import { ConfigService, UserService } from './core/services';
import { Plugins } from '@capacitor/core';

const LAST_USER = 'last_user';
const USER_LIST = 'user_list';

const { Storage } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Settings', url: '/settings/', icon: 'settings' },
    /*
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
    */
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public username = '(NO NAME)';
  public userlist: Array<string> = [];
  constructor(
    private userService: UserService,
    private configService: ConfigService
  ) {
    this.userService.onUserChange.subscribe((username) => {
      this.username = username;
      this.configService.retrieveConfig(username);
      Storage.set({ key: LAST_USER, value: this.username });
      this.addNewUser(username);
    });

    Storage.get({ key: LAST_USER }).then((user) => {
      if (user && user.value !== 'null') {
        this.userService.onUserChange.emit(user.value);
        console.log('Loading config for previous user.', user);
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
