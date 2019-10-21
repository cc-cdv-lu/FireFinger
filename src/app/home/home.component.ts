import { Component, OnInit, HostBinding } from '@angular/core';

import { StyleService, SessionService, StatisticsService } from '../core/services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  constructor(public stats: StatisticsService, public style: StyleService,
    public session: SessionService) { }

  ngOnInit() {
    this.componentCssClass = this.style.theme;
    this.style.font = this.style.font;
  }


  getProgress() {
    if (!this.session.getText()) { return 0; }
    const progress = (this.session.getIndex() / (this.session.getText().length)) * 100;
    return parseFloat(progress + '').toFixed(2);
  }

}
