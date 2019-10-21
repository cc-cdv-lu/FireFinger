import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { LevelSelectionComponent } from './level-selection/level-selection.component';
import { LoginComponent } from './login/login.component';
import { SummaryComponent } from './summary/summary.component';

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
