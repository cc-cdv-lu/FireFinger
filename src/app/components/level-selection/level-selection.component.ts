import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service'

@Component({
  selector: 'level-selection',
  templateUrl: './level-selection.component.html',
  styleUrls: ['./level-selection.component.scss']
})
export class LevelSelectionComponent implements OnInit {

  constructor(public lesson: LessonService, public session: SessionService, public router: Router) { }
  allLessons = this.lesson.lessons;
  ngOnInit() {
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

}
