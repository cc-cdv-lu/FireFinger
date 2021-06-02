import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CourseService,
  FileService,
  Course,
  UserService,
  User,
} from '@app/core/services';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
})
export class ChaptersComponent implements OnInit {
  constructor(
    private fileService: FileService,
    private courseService: CourseService,
    private router: Router,
    private userService: UserService
  ) {}

  courses: Course[];
  user: User;
  ngOnInit() {
    this.reload();
  }

  async reload() {
    this.courses = await this.fileService.getCourses();
    this.user = await this.userService.getCurrentUser();
  }

  loadLesson(course: Course, index: number) {
    this.courseService.setLesson(course, index);
    this.router.navigateByUrl('home');
    // Navigate to home
  }

  isLessonCompleted(courseId: string, lessonId: string): boolean {
    if (!this.user || !this.user.completedLessons) return false;
    const course = this.user.completedLessons.find(
      (c) => c.courseId === courseId && c.lessonId === lessonId
    );
    return course !== undefined;
  }
}
