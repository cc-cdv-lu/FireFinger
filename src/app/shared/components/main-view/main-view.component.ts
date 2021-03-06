import { Component, OnInit, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SessionService, ViewService } from '../../../core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  constructor(public session: SessionService, public view: ViewService) {}

  ngOnInit() {
    this.session.focusInput();
  }
}
