import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuickSettingsComponent } from './components/quick-settings/quick-settings.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [QuickSettingsComponent],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  exports: [QuickSettingsComponent],
})
export class SharedModule {}
