import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  login(username: any) {
    this.userService.login(username);
  }

  async newUser() {
    console.log('Some new user...');

    const modal = await this.modalController.create({
      component: NewUserComponent,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    await modal.onWillDismiss().then((data) => {
      const newUser = data.data.newUser;
      if (newUser) {
        this.login(newUser);
      } else {
        console.warn('Received invalid new user...', data);
      }
    });
  }
}
