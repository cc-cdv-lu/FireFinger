import { Component, OnInit } from '@angular/core';
import { StatsService, TextService, CourseService } from '@app/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(
    private textService: TextService,
    private statsService: StatsService,
    private courseService: CourseService
  ) {}

  ngOnInit() {}

  getCourseName() {
    const course = this.courseService.getCurrentCourse();
    return course ? course.name : 'No chapter loaded';
  }

  getLessonName() {
    const lesson = this.courseService.getCurrentLesson();
    return lesson ? lesson.name : 'No lesson loaded';
  }

  getProgress() {
    return this.textService.getProgress();
  }

  getProgressText(): string {
    return Math.round(this.getProgress() * 100) + ' %';
  }

  getMistakeText(): string {
    return Math.round(this.statsService.getMistakeRatio() * 100) + '%';
  }

  getDisplay(): string {
    return this.courseService.getCurrentLesson()?.display;
  }
}
