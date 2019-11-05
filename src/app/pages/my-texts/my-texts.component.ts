import { Component, OnInit, HostBinding } from '@angular/core';

import {
  StyleService,
  FileService,
} from '../../core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-texts',
  templateUrl: './my-texts.component.html',
  styleUrls: ['./my-texts.component.scss'],
})
export class MyTextsComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  customTexts = [];
  constructor(public style: StyleService, public file: FileService) {}
  ngOnInit() {
    this.style.font = this.style.font;
    this.reloadChapters();
  }

  reloadChapters() {
    this.customTexts = [];
    // TODO: change from allDirs to custom dirs
    return (this.customTexts = this.file.loadCustomLessons());
  }

  getChapterCount() {
    let count = 0;
    for (const lesson of this.customTexts) {
      count += lesson.chapters.length;
    }
    return count;
  }
}
