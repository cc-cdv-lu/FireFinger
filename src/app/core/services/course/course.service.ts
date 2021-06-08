/***
 * THOUGHTS AND PRAYERS
 * What about having Course as an Class instance?
 * It would manager it's own events and states - instead of having multiple services doing this?
 *
 * TODO:
 * Serialize current course, lesson and index
 * End of lesson screen + move to next lesson using nextLesson()
 */
import { EventEmitter, Injectable } from '@angular/core';
import { Course, Lesson, LessonStats } from '@app/core/data.types';
import { TextService } from '@app/core/services/text/text.service';
import { FileService } from '../file/file.service';
import { StatsService } from '../stats/stats.service';

import { Storage } from '@capacitor/storage';

const SAVED_SESSION = 'SAVED_SESSION';
interface SavedSession {
  index: number;
  courseId: string;
  lessonId: string;
  stats?: LessonStats;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(
    private textService: TextService,
    private fileService: FileService,
    private statsService: StatsService
  ) {
    // This should be somewhere else...
    this.restorePreviousSession();

    fileService.onFilesParsedToCourses.subscribe((courses) => {
      this.courses = courses;
      this.onCoursesLoaded.emit(courses);
    });

    this.textService.onTextChanged.subscribe((text: string) => {
      this.currentCourse = undefined;
      this.currentLesson = undefined;
      this.currentLessonIndex = undefined;
    });
  }

  currentCourse: Course = undefined;
  currentLesson: Lesson = undefined;
  currentLessonIndex: number = undefined;
  courses: Course[];

  onCoursesLoaded: EventEmitter<Course[]> = new EventEmitter<Course[]>();

  /**
   * Tries to load previous session. If another session is already is loaded, the loading is stopped.
   */
  async restorePreviousSession() {
    if (this.currentCourse && this.currentLesson) {
      return;
    }

    if (!this.courses) this.courses = await this.fileService.getCourses();

    const val = await Storage.get({ key: SAVED_SESSION });
    if (!val?.value) return console.warn('No previous session found...');

    const session = JSON.parse(val.value) as SavedSession;
    const course = this.getCourse(session.courseId);

    if (session.stats) this.statsService.stats = session.stats;

    const lessonIndex = course.lessons.findIndex(
      (l) => l.id === session.lessonId
    );

    if (course && lessonIndex >= 0 && session.index >= 0) {
      this.setLesson(course, lessonIndex);
      this.textService.setIndex(session.index);
    }
    console.log('Loaded previous session.', session);
  }

  /**
   * Saves current session to storage
   */
  async saveSession() {
    const savedSession: SavedSession = {
      index: this.textService.getIndex(),
      courseId: this.getCurrentCourse().id,
      lessonId: this.getCurrentLesson().id,
      stats: this.statsService.stats,
    };
    Storage.set({
      key: SAVED_SESSION,
      value: JSON.stringify(savedSession),
    });
  }

  /**
   * Clear saved session from storage
   */
  async clearSession() {
    await Storage.remove({ key: SAVED_SESSION });
  }

  /**
   * @returns the currently loaded course or undefined if none is loaded
   */
  getCurrentCourse(): Course {
    return this.currentCourse;
  }

  /**
   * @returns a list of available courses
   */
  async getCourses(): Promise<Course[]> {
    if (!this.courses) {
      this.courses = await this.fileService.getCourses();
    }
    return this.courses;
  }

  /**
   * Find course by id
   * @param id of the course
   * @returns course with matching id
   */
  getCourse(id: string): Course {
    if (!this.courses) return undefined;
    return this.courses.find((course) => course.id === id);
  }

  /**
   * Find lesson by id
   * @param courseId id of the course
   * @param lessonId id of the lesson
   */
  getLesson(courseId: string, lessonId: string): Lesson {
    if (!this.courses) return undefined;
    const course = this.getCourse(courseId);
    if (!course) return undefined;
    return course.lessons.find((lesson) => lesson.id === lessonId);
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
    console.warn('Setting text to:\n', text);
    this.statsService.reset();
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
