import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
  },
];

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class EditorModule {}
