import { Component, OnInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { StyleService } from '../../services/style.service';
import { StatisticsService } from '../../services/statistics.service'
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginField') loginField: ElementRef;
  inputField: string;
  @HostBinding('class') componentCssClass;

  constructor(private electron: ElectronService, private user: UserService, private router: Router,
    public style: StyleService, public stats: StatisticsService) {
    let lastUser = this.electron.config.get("LAST_LOGIN");
    if (!lastUser)
      this.inputField = "";
    else {
      this.inputField = lastUser.name
    }

    this.style.font = this.style.font;
  }
  ngOnInit() {
    this.loginField.nativeElement.focus();
    this.componentCssClass = this.style.theme;
  }

  isFieldInvalid(username: string) {
    if (!username) return true;
    if (username = "") return true;

    return false;
  }

  onConfirm() {
    if (this.isFieldInvalid(this.inputField)) return;
    else {
      this.user.login(this.inputField);
      this.router.navigateByUrl('/home');
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      console.log("Detacted enter key")
      this.onConfirm();
    }
  }


  getFormat(n: number) {
    if (!n) return ""
    return parseFloat(n.toFixed(2))
  }


}
