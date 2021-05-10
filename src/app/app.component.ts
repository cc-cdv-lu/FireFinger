import { Component } from '@angular/core';
import { UserService } from './core/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Chapters', url: 'chapters', icon: 'book' },
    { title: 'Texts', url: 'texts', icon: 'document-text' },
    { title: 'Settings', url: '/settings/', icon: 'settings' },
  ];
  constructor(private userService: UserService) {
    this.userService.prepare();
  }

  getUsername() {
    return this.userService.username;
  }
}
