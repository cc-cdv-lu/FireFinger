import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {}

  getUsername() {
    this.userService.username;
  }

  login(username: string) {
    this.userService.login(username);
  }

  getUserlist() {
    return this.userService.userlist;
  }

  newUser() {
    console.log('Some new user...');
  }
}
