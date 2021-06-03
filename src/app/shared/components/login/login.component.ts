import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Dialog } from '@capacitor/dialog';

import { UserService } from '@app/core';
import { NewUserComponent } from '../new-user/new-user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public userService: UserService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  getUsername() {
    return this.userService.username;
  }
  getUserlist() {
    return this.userService.userlist;
  }

  login(event: any) {
    console.log(event);
    const username = event.detail.value;
    this.userService.login(username);
  }

  async newUser() {
    console.log('Some new user...');

    const { value, cancelled } = await Dialog.prompt({
      title: 'New user',
      message: `Enter username:`,
    });
    if (value) {
      this.userService.login(value);
    } else {
      console.warn('Received invalid new user...', cancelled);
    }
    return;
  }
}
