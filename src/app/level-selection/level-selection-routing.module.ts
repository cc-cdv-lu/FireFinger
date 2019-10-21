import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LevelSelectionComponent } from './level-selection.component';

const routes: Routes = [
  {
    path: 'levels',
    component: LevelSelectionComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelSelectionRoutingModule {}
