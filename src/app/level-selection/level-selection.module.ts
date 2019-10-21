import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LevelSelectionComponent } from './level-selection.component';
import { SharedModule } from '../shared/shared.module';
import { LevelSelectionRoutingModule } from './level-selection-routing.module';

@NgModule({
  declarations: [LevelSelectionComponent],
  imports: [CommonModule, SharedModule, LevelSelectionRoutingModule],
  exports: [LevelSelectionComponent],
})
export class LevelSelectionModule {}
