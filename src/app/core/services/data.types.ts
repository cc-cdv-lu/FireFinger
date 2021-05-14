/* STYLE */
export type Style = {
  fontSize: number;
  fontFamily: string;
  showHelper: boolean;
};

export const DEFAULT_STYLE: Style = {
  fontFamily: 'Arial',
  fontSize: 5,
  showHelper: false,
};

/* STATS */
export type UserStats = {};
export type LessonStats = {
  rating: number;
  time: number;
  mistakes: number;
  length: number;
};
export type SessionsStats = {
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

export type User = {
  stats: UserStats;
  name: string;
  completedLessons?: Array<CompletedLesson>;
};

/*xxxx*/

/* COURSES */
export type Course = {
  lessons: Array<Lesson>;
  id: string;
  name: string;
  description: string;
};
export type Lesson = {
  id: string;
  name: string;
  description: string;
  type: string; // Courses type (text, image, ...)
  display: string; // Prefered display style
};
// Saved in user config?
export type CompletedLesson = {
  date: Date;
  stats: LessonStats;
};
