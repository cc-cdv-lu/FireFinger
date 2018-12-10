import { Component, OnInit } from '@angular/core';

import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service';
import { StyleService } from '../../services/style.service';
import { UserService } from '../../services/user.service';
import { StatisticsService } from '../../services/statistics.service';
import { ReaderService } from '../../services/reader.service';

import { ElectronService } from '../../providers/electron.service';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  langs = [
    {
      id: 'de',
      description: this.translate.instant('settings.lang.de'),
    },
    {
      id: 'fr',
      description: this.translate.instant('settings.lang.fr'),
    },
    {
      id: 'en',
      description: this.translate.instant('settings.lang.en'),
    },
  ];

  lang;

  voiceSettings = [
    {
      translate_key: 'settings.voice.other.amplitude',
      value_key: 'amplitude',
      min: 50,
      max: 200,
    },
    {
      translate_key: 'settings.voice.other.pitch',
      value_key: 'pitch',
      min: 50,
      max: 200,
    },
    {
      translate_key: 'settings.voice.other.speed',
      value_key: 'speed',
      min: 50,
      max: 400,
    },
    {
      translate_key: 'settings.voice.other.volume',
      value_key: 'volume',
      min: 0.0,
      max: 1.0,
    },
    {
      translate_key: 'settings.voice.other.capitals',
      value_key: 'capitals',
      min: 0.0,
      max: 30.0,
    },
  ];

  allLessons = this.lessons.lessons;
  Math = Math;

  constructor(
    public lessons: LessonService,
    public session: SessionService,
    public style: StyleService,
    public user: UserService,
    public stats: StatisticsService,
    public reader: ReaderService,
    public translate: TranslateService,
    private electron: ElectronService
  ) {}

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.style.font = this.style.font;
  }

  onVoiceChange() {
    this.reader.loadVoice(this.reader.config.voice);
  }

  readTest() {
    this.reader.play(this.reader.config.test, 2);
  }

  onLangChange() {
    this.translate.use(this.lang);
    this.electron.config.set('LANG', this.lang);
  }
  changeTheme(theme) {
    this.style.theme = theme;
  }
}
