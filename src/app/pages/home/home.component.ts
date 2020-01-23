import { Component, OnInit, HostBinding } from '@angular/core';

import { StyleService, SessionService, StatisticsService } from '../../core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  constructor(
    public stats: StatisticsService,
    public style: StyleService,
    public session: SessionService
  ) {}

  ngOnInit() {
    this.componentCssClass = this.style.theme;
    // The following line needs to be present for the font size to be applied
    this.style.font = this.style.font;
  }
}
