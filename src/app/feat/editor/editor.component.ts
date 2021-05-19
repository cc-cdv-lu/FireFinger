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

  /* TODO:
  SAVE TO FILE SEEMS NOT TO WORK?
  LOADS 9 LESSONS INSTEAD OF 3???
  */

  courseList: Course[];
  private savedContent: Course[];
  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.loadAllFromFile();
  }

  debug() {
    console.log('Loaded course:', this.loadedCourse);
  }

  /* File related */

  async loadAllFromFile() {
    this.courseList = await this.fileService.loadCourses();
    this.savedContent = JSON.parse(JSON.stringify(this.courseList)) as Course[];
    if (this.courseList.length > 0) {
      this.loadedCourse = this.courseList[0];
    } else {
      this.loadedCourse = undefined;
    }
  }

  async createDefaultCourses() {
    await this.fileService.createDefaultCourses();
    await this.loadAllFromFile();
  }

  async deleteAllTheThings() {
    await this.fileService.deleteAllTheThings();
    await this.loadAllFromFile();
  }

  async saveAllToFile() {
    await this.fileService.saveCourses(this.courseList);
    this.savedContent = this.courseList;
  }

  /* Local stuff*/

  hasChanges(): boolean {
    return (
      JSON.stringify(this.courseList) !== JSON.stringify(this.savedContent)
    );
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

  deleteLesson(lessonId: string) {
    const index = this.loadedCourse.lessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (index) {
      this.loadedCourse.lessons.splice(index, 1);
    }
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
