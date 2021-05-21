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
import { Course, Lesson } from '@app/core/data.types';
import { Storage } from '@capacitor/storage';
import { TextService } from '@app/core/services/text/text.service';
import { FileService } from '../file/file.service';

const SAVED_SESSION = 'SAVED_SESSION';
interface SavedSession {
  index: number;
  courseId: string;
  lessonId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private textService: TextService, fileService: FileService) {
    // This should be somewhere else...
    /*
    fileService.onCoursesLoaded.subscribe((courses) => {
      if (this.currentCourse && this.currentLesson) {
        return;
      }
      Storage.get({ key: SAVED_SESSION }).then((val) => {
        if (val && val.value) {
          const session = JSON.parse(val.value) as SavedSession;
          const course = courses.find((c) => (c.id = session.courseId));
          const lessonIndex = course.lessons.findIndex(
            (l) => (l.id = session.lessonId)
          );
          if (course && lessonIndex && session.index) {
            this.setLesson(course, lessonIndex);
            this.textService.setIndex(session.index);
          }
        }
      });
    });
    */

    this.textService.onTextChanged.subscribe((text: string) => {
      this.currentCourse = undefined;
      this.currentLesson = undefined;
      this.currentLessonIndex = undefined;
    });

    // TODO: add eventemitter to fileservice to check if courses are loaded and then set last session
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
