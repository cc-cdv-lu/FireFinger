import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';

import {
  HomeComponent,
  SettingsComponent,
  SummaryComponent,
  LevelSelectionComponent,
  LoginComponent,
  MyTextsComponent,
  SimpleWinComponent,
} from './';

@NgModule({
  declarations: [
    HomeComponent,
    SimpleWinComponent,
    SettingsComponent,
    LevelSelectionComponent,
    LoginComponent,
    SummaryComponent,
    MyTextsComponent,
  ],
  imports: [CommonModule, SharedModule, PagesRoutingModule],
  providers: [SettingsComponent],
  exports: [
    PagesRoutingModule,
    HomeComponent,
    SimpleWinComponent,
    SettingsComponent,
    LevelSelectionComponent,
    LoginComponent,
    SummaryComponent,
    MyTextsComponent,
  ],
})
export class PagesModule {}
