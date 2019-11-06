import { Component, OnInit } from '@angular/core';

import {
  SessionService,
  StyleService,
  UserService,
  StatisticsService,
  ReaderService,
  ElectronService,
  FileService,
} from '../../core';

import { AppConfig } from '../../../environments/environment';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public version: string = AppConfig.VERSION;
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

  difficultySettings = [
    {
      translate_key: 'settings.application.difficulty.maxMistakePercentage',
      value_key: 'maxMistakePercentage',
      min: 0,
      max: 100,
    },
    {
      translate_key: 'settings.application.difficulty.maxMistakeCount',
      value_key: 'maxMistakeCount',
      min: 0,
      max: 250,
    },
    {
      translate_key: 'settings.application.difficulty.minTypeSpeed',
      value_key: 'minTypeSpeed',
      min: 0,
      max: 250,
    },
  ];

  // allLessons = this.lessons.lessons;
  Math = Math;

  constructor(
    public session: SessionService,
    public style: StyleService,
    public user: UserService,
    public stats: StatisticsService,
    public reader: ReaderService,
    public translate: TranslateService,
    public electron: ElectronService,
    public file: FileService
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

  saveSettings() {
    this.session.saveDifficulty();
    this.reader.save();
  }

  openLink(url: string) {
    this.electron.shell.openExternal(url);
  }
}
