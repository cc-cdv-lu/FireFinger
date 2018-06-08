import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { StyleService } from '../../services/style.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginField') loginField: ElementRef;
  form: FormGroup;

  constructor(private electron: ElectronService, private user: UserService, private router: Router, public style: StyleService) {
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

    /*this.form = this.fb.group({
      userName: ['', Validators.required]
    })*/
  }

  isFieldInvalid(username: string) {
    if (!username) return true;
    if (username = "") return true;

    return false;
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
