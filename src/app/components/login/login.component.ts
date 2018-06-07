import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  @ViewChild('loginField') loginField;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private user: UserService, public dialogRef: MatDialogRef<LoginComponent>) {
    console.log(data)
    this.inputField = data.name;

  }
  inputField: string;
  ngOnInit() {
    this.loginField.nativeElement.focus();
  }

  onConfirm() {
    this.user.login(this.inputField);
    this.dialogRef.close();
  }

  onKeydown(event: KeyboardEvent) {
    console.log(event)
    if (event.key == 'Enter') {
      console.log("Detacted enter key")
      this.onConfirm();
    }
  }

}
