import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [SettingsComponent],
  providers: [SettingsComponent],
  imports: [CommonModule, SharedModule, SettingsRoutingModule],
  exports: [SettingsComponent],
})
export class SettingsModule {}
