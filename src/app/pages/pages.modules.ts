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
} from './';

@NgModule({
  declarations: [
    HomeComponent,
    SettingsComponent,
    LevelSelectionComponent,
    LoginComponent,
    SummaryComponent,
  ],
  imports: [CommonModule, SharedModule, PagesRoutingModule],
  providers: [SettingsComponent],
  exports: [
    PagesRoutingModule,
    HomeComponent,
    SettingsComponent,
    LevelSelectionComponent,
    LoginComponent,
    SummaryComponent,
  ],
})
export class PagesModule {}
