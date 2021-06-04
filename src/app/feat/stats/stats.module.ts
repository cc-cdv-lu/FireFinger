import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    component: StatsComponent,
  },
];

@NgModule({
  declarations: [StatsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class StatsModule {}
