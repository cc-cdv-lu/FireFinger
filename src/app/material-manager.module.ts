import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatGridListModule, MatButtonModule, MatIconModule, MatDialogModule, MatExpansionModule,
  MatSliderModule, MatInputModule, MatCardModule, MatFormFieldModule, MatProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatSliderModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule
  ],
  declarations: [],
  exports: [
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatSliderModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule
  ]
})
export class MaterialManagerModule { }
