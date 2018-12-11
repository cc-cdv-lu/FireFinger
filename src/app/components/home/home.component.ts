import { Component, OnInit, HostBinding } from '@angular/core';


import { StyleService } from '../../services/style.service';
import { SessionService } from '../../services/session.service';
import { StatisticsService } from '../../services/statistics.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  constructor(public stats: StatisticsService, public style: StyleService,
    public session: SessionService, private electron: ElectronService) { }

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
