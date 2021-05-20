import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/core';
import { CourseService } from 'src/app/core/services/course/course.service';
import { FileService } from 'src/app/core/services/file/file.service';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
})
export class ChaptersComponent implements OnInit {
  constructor(
    private fileService: FileService,
    private courseService: CourseService,
    private router: Router
  ) {}

  courses: Course[];

  ngOnInit() {
    this.reload();
  }

  async reload() {
    this.courses = await this.fileService.getCourses();
  }

  loadLesson(course: Course, index: number) {
    this.courseService.setLesson(course, index);
    this.router.navigateByUrl('home');
    // Navigate to home
  }
}
