import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuickSettingsComponent } from './components/quick-settings/quick-settings.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [QuickSettingsComponent, LoginComponent],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  exports: [QuickSettingsComponent, LoginComponent],
})
export class SharedModule {}
