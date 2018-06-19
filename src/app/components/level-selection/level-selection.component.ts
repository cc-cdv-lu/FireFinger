import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router'

import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service';
import { StyleService, SIZE } from '../../services/style.service';

@Component({
  selector: 'level-selection',
  templateUrl: './level-selection.component.html',
  styleUrls: ['./level-selection.component.scss']
})
export class LevelSelectionComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  SIZE = SIZE;
  constructor(public lesson: LessonService, public session: SessionService, public router: Router, public style: StyleService) { }
  allLessons = this.lesson.lessons;
  ngOnInit() {
    this.componentCssClass = this.style.theme;
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

}
