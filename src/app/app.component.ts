import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from './core/services';
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
  constructor(
    private userService: UserService,
    private menuController: MenuController
  ) {
    this.userService.onUserChange.subscribe(
      (username) => (this.username = username)
    );
  }
}
