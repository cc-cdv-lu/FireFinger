import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  UserService,
  ElectronService,
  SessionService,
  SoundEffectService,
  StatisticsService,
  StringHelperService,
  StyleService,
  FileService,
  ReaderService,
  TypeService,
} from './services/';

@NgModule({
  imports: [CommonModule],
})
export class CoreModule {
  // This makes it possible to import modules with providers
  // https://wesleygrimes.com/angular/2019/02/24/angular-routing-best-practices-for-enterprise-applications.html
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        UserService,
        ElectronService,
        SessionService,
        SoundEffectService,
        StatisticsService,
        StringHelperService,
        StyleService,
        FileService,
        ReaderService,
        TypeService,
      ],
    };
  }
}
