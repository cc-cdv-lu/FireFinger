import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule, MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [],
  exports: [
    MatGridListModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MaterialManagerModule { }
