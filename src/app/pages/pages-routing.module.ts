import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {
  HomeComponent,
  SettingsComponent,
  SummaryComponent,
  LevelSelectionComponent,
  LoginComponent,
  MyTextsComponent,
  SimpleWinComponent,
} from './';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'simple-win',
    component: SimpleWinComponent,
  },
  {
    path: 'levels',
    component: LevelSelectionComponent,
  },
  {
    path: 'my-texts',
    component: MyTextsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
