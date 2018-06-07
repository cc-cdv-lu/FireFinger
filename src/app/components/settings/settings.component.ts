import { Component, OnInit } from '@angular/core';

import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service';
import { StyleService } from '../../services/style.service';
import { User, UserService } from '../../services/user.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  allLessons = this.lessonService.lessons;

  constructor(private lessonService: LessonService, private session: SessionService, private style: StyleService, private user: UserService) { }

  ngOnInit() {
  }

  loadChapter(content: string, name: string, user: User) {
    this.session.loadSession(content, name, user);
  }

}
