import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { StatisticsService, Statistics } from '../../services/statistics.service';
import { SessionService, GAME_STATE } from '../../services/session.service'
import { StyleService } from '../../services/style.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  session_stats: Statistics;

  constructor(private user: UserService, private stats: StatisticsService, private session: SessionService,
    public translate: TranslateService, public style: StyleService) { }
  /*
    Needed data:
      Chapter that has just been solved
      Mistakes count
      Most mistakes on letter xxx
      Did win?
        If not, why not? (slow, mistakes, %)?

  */
  didWin(): boolean {
    return this.session.gameState == GAME_STATE.SUCCESS
  }

  ngOnInit() {
    this.loadData();
    this.style.font = this.style.font;
  }

  loadData() {
    if (!this.user.loggedInUser) return;

    this.session_stats = this.user.loggedInUser.lastSessionStats;
  }

  getResultText() {
    if (this.didWin()) {
      return this.translate.instant('summary.result.win')
    }
    else {
      return this.translate.instant('summary.result.fail')
    }
  }

}
