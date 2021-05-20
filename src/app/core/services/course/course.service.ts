import { Injectable } from '@angular/core';
import { Course, Lesson } from '../../data.types';
import { TextService } from '../text/text.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  /***
   * What about having Course as an Class instance?
   * It would manager it's own events and states - instead of having multiple services doing this?
   */

  constructor(private textService: TextService) {
    this.textService.onTextChanged.subscribe((text: string) => {
      this.currentCourse = undefined;
      this.currentLesson = undefined;
      this.currentLessonIndex = undefined;
    });
  }

  currentCourse: Course = undefined;
  currentLesson: Lesson = undefined;
  currentLessonIndex: number = undefined;

  getCurrentLesson() {
    return this.currentCourse.lessons[this.currentLessonIndex];
  }

  setLesson(course: Course, index: number) {
    this.textService.setText(course[index].content);
    this.currentCourse = course;
    this.currentLesson = course.lessons[index];
  }

  nextLesson() {
    if (this.currentLessonIndex + 1 < this.currentCourse.lessons.length) {
      this.setLesson(this.currentCourse, ++this.currentLessonIndex);
    } else {
      console.warn('Reached end of course.');
    }
  }
}
