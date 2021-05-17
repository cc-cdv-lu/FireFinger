/* STYLE */
export interface Style {
  fontSize: number;
  fontFamily: string;
  showHelper: boolean;
}

export const DEFAULT_STYLE: Style = {
  fontFamily: 'Arial',
  fontSize: 5,
  showHelper: false,
};

/* STATS */
export interface UserStats {}
export interface LessonStats {
  rating: number;
  time: number;
  mistakes: number;
  length: number;
}
export interface SessionsStats {
  // How many letters were typed since last mistake
  combo: number;
  sessionStats: LessonStats;
}

export const DEFUALT_STATS: UserStats = {};

/* USER */
export const DEFAULT_USER: User = {
  stats: DEFUALT_STATS,
  name: '(no name)',
};

export interface User {
  stats: UserStats;
  name: string;
  completedLessons?: Array<CompletedLesson>;
}

/*xxxx*/

/* COURSES */
export interface Course {
  lessons: Array<Lesson>;
  id: string;
  name: string;
  description: string;
}
export interface Lesson {
  id: string;
  name: string;
  description: string;
  type: string; // Courses interface (text, image, ...)
  display: string; // Prefered display style
}
// Saved in user
export interface CompletedLesson {
  date: Date;
  courseId: string;
  lessonId: string;
  stats: LessonStats;
}

export const DISPLAY_TYPES: Array<string> = ['DEFAULT'];
export const LESSON_TYPES: Array<string> = ['DEFAULT'];
