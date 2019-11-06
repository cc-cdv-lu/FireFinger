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

  ngOnInit() {
    this.focusFocus();
  }

  focusFocus() {
    setTimeout(() => {
      const focus = document.getElementById('initFocus');
      console.log('Focus:', focus);
      if (focus) {
        focus.setAttribute('tabindex', '1');
        focus.focus();
      }
    }, 500);
  }

  goHome() {
    this.router.navigateByUrl('/');
  }
}
