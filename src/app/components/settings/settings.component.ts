import { Component, OnInit } from '@angular/core';

import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service';
import { StyleService } from '../../services/style.service';
import { User, UserService } from '../../services/user.service'
import { StatisticsService } from '../../services/statistics.service'
import { ReaderService } from '../../services/reader.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  allLessons = this.lessons.lessons;

  constructor(public lessons: LessonService, public session: SessionService, public style: StyleService, public user: UserService, public stats: StatisticsService, public reader: ReaderService) { }
  Math = Math;
  ngOnInit() {
  }

  getFormat(n: number) {
    if (!n) return ""
    return parseFloat(n.toFixed(2))
  }

  onVoiceChange(ev) {
    this.reader.loadVoice(this.reader.config.voice);
  }

  readTest() {
    this.reader.play(this.reader.config.test)
  }

}
