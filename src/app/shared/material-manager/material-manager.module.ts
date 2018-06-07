import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule, MatButtonModule, MatIconModule, MatDialogModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule
  ],
  declarations: [],
  exports: [
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule
  ]
})
export class MaterialManagerModule { }
