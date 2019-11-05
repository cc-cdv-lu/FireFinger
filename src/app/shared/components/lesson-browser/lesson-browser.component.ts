import { Component, OnInit, Input } from '@angular/core';
import { Lesson, SessionService } from '../../../core';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lesson-browser',
  templateUrl: './lesson-browser.component.html',
  styleUrls: ['./lesson-browser.component.scss'],
})
export class LessonBrowserComponent implements OnInit {
  @Input() lessons: Array<Lesson>;

  constructor(public session: SessionService, public router: Router) {}

  ngOnInit() {}

  goHome() {
    this.router.navigateByUrl('/');
  }
}
