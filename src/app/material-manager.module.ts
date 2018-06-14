import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatGridListModule, MatButtonModule, MatIconModule, MatDialogModule, MatExpansionModule,
  MatSliderModule, MatInputModule, MatCardModule, MatFormFieldModule, MatProgressBarModule,
  MatSlideToggleModule, MatSelectModule
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
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSelectModule
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
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSelectModule
  ]
})
export class MaterialManagerModule { }
