import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import {
  LessonService,
  SessionService,
  StyleService,
  FileService,
} from '../core/services/index';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'level-selection',
  templateUrl: './level-selection.component.html',
  styleUrls: ['./level-selection.component.scss'],
})
export class LevelSelectionComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  constructor(
    public lesson: LessonService,
    public session: SessionService,
    public router: Router,
    public style: StyleService,
    public file: FileService
  ) {}
  allLessons = this.lesson.lessons;
  ngOnInit() {
    this.style.font = this.style.font;
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

  reloadChapters() {
    this.allLessons = this.lesson.reload();
  }

  getChapterCount() {
    let count = 0;
    for (const lesson of this.allLessons) {
      count += lesson.chapters.length;
    }
    return count;
  }
}
