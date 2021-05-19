import { Component, OnInit } from '@angular/core';
import { Course, Lesson } from 'src/app/core';
import { FileService } from 'src/app/core/services/file/file.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  loadedCourse: Course = undefined;
  loadedLesson: Lesson = undefined;

  courseList: Course[];
  constructor(private fileService: FileService) {}

  ngOnInit() {
    // this.courseList = courseList;
    // this.loadedCourse = this.courseList[1];
    this.loadAllFromFile();
  }

  debug() {
    console.log('Loaded course:', this.loadedCourse);
  }

  createCourse() {
    // Move this logic to filesystem and create file simultaneously
    const newCourse = {
      id: 'Set id?',
      lessons: [],
      name: 'New course',
      description: 'Enter course description',
    };
    this.courseList.push(newCourse);
    this.loadedCourse = newCourse;
  }

  createLesson() {
    this.loadedCourse.lessons.push({
      description: 'Enter lesson description or leave empty',
      display: 'DEFAULT',
      id: 'Enter id?',
      name: 'Lesson name here',
      type: 'DEFAULT',
      content: '',
    });
  }

  async loadAllFromFile() {
    this.courseList = await this.fileService
      .loadCourses()
      .catch(() => (this.courseList = []));
    if (this.courseList.length > 0) {
      this.loadedCourse = this.courseList[0];
    }
  }

  async createDefaultCourses() {
    await this.fileService.createDefaultCourses();
  }

  async deleteAllTheThings() {
    await this.fileService.deleteAllTheThings();
    await this.loadAllFromFile();
  }

  loadCourse(courseId: string) {
    const course = this.courseList.find((course) => course.id === courseId);
    if (course) {
      this.loadedCourse = course;
    }
  }

  loadLesson(courseId: string, lessonId: string) {
    const course = this.courseList.find((course) => course.id === courseId);
    if (course) {
      // this.loadedCourse = course;
      const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
      if (lesson) {
        this.loadedLesson = lesson;
      }
    }
  }

  async saveAllToFile() {
    await this.fileService.saveCourses(this.courseList);
  }

  compareWith(o1: Course, o2: Course | Course[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: Course) => u.id === o1.id);
    }

    return o1.id === o2.id;
  }
}
