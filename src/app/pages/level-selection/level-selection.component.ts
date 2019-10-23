import { Component, OnInit, HostBinding } from '@angular/core';

import {
  StyleService,
  FileService,
} from '../../core/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'level-selection',
  templateUrl: './level-selection.component.html',
  styleUrls: ['./level-selection.component.scss'],
})
export class LevelSelectionComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  allLessons = [];
  constructor(
    public style: StyleService,
    public file: FileService
  ) {}
  ngOnInit() {
    this.style.font = this.style.font;
    this.reloadChapters();
  }


  reloadChapters() {
    this.allLessons = [];
    return (this.allLessons = this.file.loadAllDirs());
  }

  getChapterCount() {
    let count = 0;
    for (const lesson of this.allLessons) {
      count += lesson.chapters.length;
    }
    return count;
  }
}
