import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import {
  UserService,
  StyleService,
  StatisticsService,
  ElectronService,
} from '../../core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  inputField: string;
  @HostBinding('class') componentCssClass;

  constructor(
    private electron: ElectronService,
    public user: UserService,
    private router: Router,
    public style: StyleService,
    public stats: StatisticsService
  ) {
    let lastUser: any;
    if (this.electron.config) {
      lastUser = this.electron.config.get('LAST_LOGIN');
    }
    console.log('Last user:', lastUser);
    if (!lastUser) {
      this.inputField = '';
    } else {
      this.inputField = lastUser.name;
    }

    this.style.font = this.style.font;

    this.componentCssClass = this.style.theme;
    if (!this.user.loggedInUser) {
      this.onConfirm();
    }
  }

  isFieldInvalid(username: string) {
    if (!username) {
      return true;
    }
    if ((username = '')) {
      return true;
    }

    return false;
  }

  onConfirm() {
    if (this.isFieldInvalid(this.inputField)) {
      return;
    } else {
      this.user.login(this.inputField);
      this.router.navigateByUrl('/home');
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      console.log('Detacted enter key');
      this.onConfirm();
    }
  }

  getFormat(n: number) {
    if (!n) {
      return '';
    }
    return parseFloat(n.toFixed(2));
  }
}
