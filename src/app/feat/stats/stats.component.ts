import { Component, OnInit } from '@angular/core';
import {
  User,
  UserService,
  CompletedLesson,
  Course,
  Lesson,
  CourseService,
} from '@app/core';

interface CompletedLessonDisplay extends CompletedLesson {
  lesson: Lesson;
  course: Course;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  user: User;
  completedLessons: CompletedLessonDisplay[] = [];

  constructor(
    private userService: UserService,
    private courseService: CourseService
  ) {
    this.userService.onUserChange.subscribe(() => this.reloadData());

    this.courseService.onCoursesLoaded.subscribe((courses) => {
      this.reloadData();
    });
  }

  ngOnInit() {
    this.reloadData();
  }

  async reloadData() {
    this.user = await this.userService.getCurrentUser();

    // Just to initialize CourseService
    const courses = await this.courseService.getCourses();

    this.completedLessons = [];
    this.user.completedLessons.forEach((lesson) => {
      const completed = lesson as CompletedLessonDisplay;
      completed.course = this.courseService.getCourse(lesson.courseId);
      completed.lesson = this.courseService.getLesson(
        lesson.courseId,
        lesson.lessonId
      );
      console.log(completed);
      this.completedLessons.push(completed);
    });
  }

  async deleteCompletedLessons() {
    await this.reloadData();

    this.user.completedLessons = [];
    this.userService.editUser(this.user);
  }
}
