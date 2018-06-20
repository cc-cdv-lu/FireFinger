import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatGridListModule, MatButtonModule, MatIconModule, MatDialogModule, MatExpansionModule,
  MatSliderModule, MatInputModule, MatCardModule, MatFormFieldModule, MatProgressBarModule,
  MatSlideToggleModule, MatSelectModule, MatListModule, MatDividerModule, MatToolbarModule,
  MatSidenavModule
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
    MatSelectModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule
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
    MatSelectModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule
  ]
})
export class MaterialManagerModule { }
