import { Component, OnInit } from '@angular/core';

import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  allLessons = this.lessonService.lessons;

  constructor(private lessonService: LessonService, private session: SessionService) { }

  ngOnInit() {
  }

  loadChapter(content: string, name: string, user: User) {
    this.session.loadSession(content, name, user);
  }

}
