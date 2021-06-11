import { Component, OnInit } from '@angular/core';
import { Dialog } from '@capacitor/dialog';

import { User, UserService } from '@app/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public userService: UserService,
    private alertController: AlertController
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

    const alert = await this.alertController.create({
      header: 'New user',
      message: 'Enter username:',
      inputs: [
        {
          label: 'Name',
          id: 'name',
          type: 'text',
          placeholder: 'Name',
          name: 'name',
        },
        { label: 'Age', id: 'age', type: 'number', placeholder: 'Age', name: 'age' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Ok',
          handler: (d) => {
            const user = d as User;
            console.log(d);
            if (d.name) {
              this.userService.login(user);
            } else {
              console.warn('Received invalid new user...', d);
            }
          },
        },
      ],
    });
    alert.present();
  }
}
