import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ChaptersComponent } from './chapters.component';
import { IonicModule } from '@ionic/angular';

const routes: Route[] = [{
  path: '',
  component: ChaptersComponent,
},]

@NgModule({
  declarations: [ChaptersComponent],
  imports: [
    CommonModule, IonicModule, RouterModule.forChild(routes)
  ]
})
export class ChaptersModule { }
