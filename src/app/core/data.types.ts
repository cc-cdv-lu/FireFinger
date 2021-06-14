/* STYLE */
export interface Style {
  fontSize: number;
  fontFamily: string;
  showHelper: boolean;
  emojisplosion?: boolean;
}

export const DEFAULT_STYLE: Style = {
  fontFamily: 'Arial',
  fontSize: 5,
  showHelper: false,
  emojisplosion: false,
};

/* STATS */
export interface UserStats {}
export interface LessonStats {
  rating: number;
  time: number;
  mistakes: number;
  length: number;
  isSuccess?: boolean;
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
  name: string;
  stats?: UserStats;
  age?: number;
  completedLessons?: Array<CompletedLesson>;
}

/*TTS*/
export const DEFAULT_TTS: TTSConfig = {
  volume: 1.0,
  pitch: 0.9,
  rate: 1.2,
  voice: 0,
  category: 'ambient',
};
export interface TTSConfig {
  volume: number;
  pitch: number;
  rate: number;
  voice: number;
  category: 'ambient' | 'playback';
}
/*CONFIG*/
export const DEFAULT_CONFIG: Config = {
  style: DEFAULT_STYLE,
  user: DEFAULT_USER,
  tts: DEFAULT_TTS,
};

export interface Config {
  style: Style;
  user: User;
  tts: TTSConfig;
}

/*xxxx*/

/* COURSES */
export interface Course {
  lessons: Array<Lesson>;
  id: string;
  name: string;
  description: string;
  author?: string;
  creationDate?: Date;
}
export interface Lesson {
  id: string;
  name: string;
  description: string;
  type: 'shuffled_words' | 'shuffled_characters' | 'static'; // Courses interface (text, image, ...)
  display: 'character' | 'word' | 'line' | 'multiple_lines' | 'image'; // Prefered display style
  content: string;
  language?: string;
  imgSrc?: string;
  iterations?: number;
}
// Saved in user
export interface CompletedLesson {
  date: Date;
  courseId: string;
  lessonId: string;
  stats: LessonStats;
}

export interface Typing {
  expected: string;
  typed: string;
}

export const DEFAULT_COURSE: Course = {
  description: '(No description)',
  id: Date.now().toString(),
  lessons: [],
  name: '(No name)',
};

export const DEFAULT_LESSON: Lesson = {
  content: '',
  description: '(No description)',
  display: 'line',
  id: Date.now().toString(),
  name: '(No name)',
  type: 'static',
};

export const DISPLAY_TYPES: Array<string> = ['DEFAULT'];
export const LESSON_TYPES: Array<string> = ['DEFAULT'];
