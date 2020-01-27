import { Component, OnInit, HostBinding } from '@angular/core';
import { SessionService, ViewService } from '../../../core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'simple-view',
  templateUrl: './simple-view.component.html',
  styleUrls: ['./simple-view.component.scss'],
})
export class SimpleViewComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  constructor(public session: SessionService, public view: ViewService) {}

  ngOnInit() {
    this.session.focusInput();
  }
}
