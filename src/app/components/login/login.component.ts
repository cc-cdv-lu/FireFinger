import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //TODO load last used login from storage
  //TODO save used login to storage
  //TODO trigger onCofirm when hitting enter
  //TODO grab focus
  //[mat-dialog-close]="inputField != ''"

  @ViewChild('loginField') loginField: ElementRef;

  constructor(private electron: ElectronService, private user: UserService, private router: Router) {
    let lastUser = this.electron.config.get("LAST_LOGIN");
    if (!lastUser)
      this.inputField = "";
    else {
      this.inputField = lastUser.name
    }
  }
  inputField: string;
  ngOnInit() {
    this.loginField.nativeElement.focus();
  }

  onConfirm() {
    if (this.inputField == "") return;
    this.user.login(this.inputField);
    //TODO route to home
    this.router.navigateByUrl('/home');
  }

  onKeydown(event: KeyboardEvent) {
    console.log(event)
    if (event.key == 'Enter') {
      console.log("Detacted enter key")
      this.onConfirm();
    }
  }

}
