import { Component, OnInit } from '@angular/core';

import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service';
import { StyleService, SIZE } from '../../services/style.service';
import { User, UserService } from '../../services/user.service'
import { StatisticsService } from '../../services/statistics.service'
import { ReaderService } from '../../services/reader.service';

import { ElectronService } from '../../providers/electron.service';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  langs = [
    {
      id: 'de',
      description: this.translate.instant('settings.lang.de')
    },
    {
      id: 'fr',
      description: this.translate.instant('settings.lang.fr')
    },
    {
      id: 'en',
      description: this.translate.instant('settings.lang.en')
    }
  ]
  lang;

  allLessons = this.lessons.lessons;
  SIZE = SIZE;
  constructor(public lessons: LessonService, public session: SessionService, public style: StyleService, public user: UserService,
    public stats: StatisticsService, public reader: ReaderService, public translate: TranslateService, private electron: ElectronService) { }
  Math = Math;
  ngOnInit() {
    this.lang = this.translate.currentLang;
  }

  getFormat(n: number) {
    if (!n) return ""
    return parseFloat(n.toFixed(2))
  }

  onVoiceChange() {
    this.reader.loadVoice(this.reader.config.voice);
  }

  readTest() {
    this.reader.play(this.reader.config.test, 2)
  }

  onLangChange() {
    this.translate.use(this.lang);
    this.electron.config.set("LANG", this.lang)
  }
  changeTheme(theme) {
    this.style.theme = theme;
  }



}
