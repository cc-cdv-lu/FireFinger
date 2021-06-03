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
    const lesson = course.lessons[index];
    let text = '';
    if (!lesson.type || lesson.type === 'static') {
      text = lesson.content;
    } else if (lesson.type === 'shuffled_characters') {
      for (let i = 0; i < lesson.iterations; i++) {
        const randomIndex = Math.round(
          Math.random() * (lesson.content.length - 1)
        );
        text += lesson.content[randomIndex];
      }
    } else if (lesson.type === 'shuffled_words') {
      for (let i = 0; i < lesson.iterations; i++) {
        const regexp = new RegExp('[ \n]');
        const split = lesson.content.split(regexp);
        console.log('Lesson split:', split);
        const randomIndex = Math.round(Math.random() * (split.length - 1));
        text += split[randomIndex] += '\n';
      }
    }
    console.warn('Setting text to:', text);
    this.textService.setText(text);
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
