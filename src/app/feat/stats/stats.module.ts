import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';
import { Route, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Route[] = [
  {
    path: '',
    component: StatsComponent,
  },
];

@NgModule({
  declarations: [StatsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), IonicModule],
})
export class StatsModule {}
