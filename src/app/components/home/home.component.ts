import { Component, OnInit } from '@angular/core';


import { StyleService, SIZE } from '../../services/style.service';
import { SessionService } from '../../services/session.service';
import { StatisticsService } from '../../services/statistics.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  SIZE = SIZE;
  constructor(public stats: StatisticsService, public style: StyleService,
    public session: SessionService, private electron: ElectronService) { }

  ngOnInit() {
  }


  getProgress() {
    if (!this.session.getText()) return 0;
    let progress = (this.session.getIndex() / (this.session.getText().length)) * 100;
    return parseFloat(progress + "").toFixed(2);
  }

  closeApp() {
    console.warn("Shutting game down...");
    if (this.electron.window)
      this.electron.window.close();
    else
      window.close();
  }

}
