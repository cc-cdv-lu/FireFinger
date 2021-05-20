/***
 * THOUGHTS AND PRAYERS
 * What about having Course as an Class instance?
 * It would manager it's own events and states - instead of having multiple services doing this?
 * 
 * TODO:
 * Serialize current course, lesson and index
 * End of lesson screen + move to next lesson using nextLesson()
 */
import { Injectable } from '@angular/core';
import { Course, Lesson } from '../../data.types';
import { TextService } from '../text/text.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

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

  /**
   * @returns the currently loaded course or undefined if none is loaded
   */
  getCurrentCourse(): Course {
    return this.currentCourse;
  }

  /**
   * @returns the currently loaded lesson or undefined if none is loaded
   */
  getCurrentLesson(): Lesson {
    if (!this.currentCourse) {
      return undefined;
    }
    return this.currentCourse.lessons[this.currentLessonIndex];
  }

  setLesson(course: Course, index: number) {
    this.textService.setText(course.lessons[index].content);
    this.currentLessonIndex = index;
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
