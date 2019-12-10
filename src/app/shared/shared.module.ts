import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { MaterialManagerModule } from './material-manager.module';

import {
  PageNotFoundComponent,
  MainViewComponent,
  LessonBrowserComponent,
  SelfUpdaterComponent,
} from '.';
import { WebviewDirective } from './directives/';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    MainViewComponent,
    LessonBrowserComponent,
    SelfUpdaterComponent,
  ],
  imports: [CommonModule, TranslateModule, MaterialManagerModule, FormsModule],
  exports: [
    TranslateModule,
    WebviewDirective,
    MaterialManagerModule,
    MainViewComponent,
    SelfUpdaterComponent,
    FormsModule,
    LessonBrowserComponent,
  ],
})
export class SharedModule {}
