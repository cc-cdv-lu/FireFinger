import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Course, Lesson, FileService } from '@app/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  loadedCourse: Course = undefined;
  loadedLesson: Lesson = undefined;
  courseList: Course[];
  private savedContent: Course[];

  lessonTypes = [
    { title: 'Random words', id: 'random_words' },
    { title: 'Standard', id: 'DEFAULT' },
    { title: 'Simple image', id: 'images' },
  ];
  lessonDisplays = [
    { title: 'Single character', id: 'single_character' },
    { title: 'Line', id: 'DEFAULT' },
    { title: 'Multiple lines', id: 'multiple_lines' },
  ];

  constructor(private fileService: FileService, private http: HttpClient) {}

  ngOnInit() {
    this.loadAllFromFile();
  }

  debug() {
    console.log('Loaded course:', this.loadedCourse);
  }

  /* File related */

  async loadAllFromFile() {
    this.courseList = await this.fileService.getCourses();
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
      id: 'courseID-' + Date.now(),
      lessons: [],
      name: 'New course',
      description: 'Enter course description',
    };
    this.courseList.push(newCourse);
    this.loadedCourse = newCourse;
  }

  createLesson() {
    const newLesson = {
      description: 'Enter lesson description or leave empty',
      display: 'DEFAULT',
      id: 'lessonID-' + Date.now(),
      name: 'Lesson name here',
      type: 'DEFAULT',
      content: '',
    } as Lesson;
    this.loadedCourse.lessons.push(newLesson);
    this.loadedLesson = newLesson;
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

  deleteCourse(courseId: string) {
    const index = this.courseList.findIndex((course) => course.id === courseId);
    if (index >= 0) {
      this.courseList.splice(index, 1);
    }
    if (this.courseList.length > 0) {
      this.loadedCourse = this.courseList[0];
    }
  }

  deleteLesson(lessonId: string) {
    const index = this.loadedCourse.lessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (index >= 0) {
      this.loadedCourse.lessons.splice(index, 1);
    }
    this.loadedLesson = undefined;
  }

  async exportCourses() {
    await this.saveAllToFile();
    const data = JSON.stringify({ courses: this.courseList });
    this.createDownload('courses.ff', data);
  }

  /**
   * Handle selected file to be imported as course
   * @param event Ion-Input chose file event
   */
  chooseFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.addEventListener('load', (event) => {
      const result = JSON.parse(reader.result as string);
      const courses = result.courses as Course[];

      this.courseList = this.courseList.concat(courses);
      if (this.courseList.length > 0) {
        this.loadedCourse = this.courseList[0];
      }
      this.saveAllToFile();
    });
  }

  createDownload(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  compareWith(o1: Course | Lesson, o2: Course | Course[] | Lesson | Lesson[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: Course | Lesson) => u.id === o1.id);
    }

    return o1.id === o2.id;
  }
}
