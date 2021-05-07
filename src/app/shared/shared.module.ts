import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickSettingsComponent } from './components/quick-settings/quick-settings.component'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'



@NgModule({
  declarations: [QuickSettingsComponent],
  imports: [CommonModule, FormsModule],
  exports: [QuickSettingsComponent],
})
export class SharedModule {}
