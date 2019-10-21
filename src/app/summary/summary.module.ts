import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryComponent } from './summary.component';
import { SharedModule } from '../shared/shared.module';
import { SummaryRoutingModule } from './summary-routing.module';

@NgModule({
  declarations: [SummaryComponent],
  imports: [CommonModule, SharedModule, SummaryRoutingModule],
  exports: [SummaryComponent]
})
export class SummaryModule {}
