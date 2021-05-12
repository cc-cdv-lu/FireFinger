import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuickSettingsComponent } from './components/quick-settings/quick-settings.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { IonicThemeSwitcherModule } from 'ionic-theme-switcher';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { DarkModeToggleComponent } from './components/dark-mode-toggle/dark-mode-toggle.component';

@NgModule({
  declarations: [
    QuickSettingsComponent,
    LoginComponent,
    NewUserComponent,
    ThemeSwitcherComponent,
    DarkModeToggleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    IonicThemeSwitcherModule,
  ],
  exports: [QuickSettingsComponent, LoginComponent],
})
export class SharedModule {}
