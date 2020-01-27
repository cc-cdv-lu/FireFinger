export class Lesson {
  name: string;
  chapters: Array<Chapter>;
  lang: string;
}
export class Chapter {
  name: string;
  content: string;
  type: ChapterType;
  characters: string;
  newCharacters: string;
  amount: number;
  data?: {
    soundSRC?: string;
    imageSRC?: string;
  };
}
export enum ChapterType {
  CHAR,
  WORD,
  DICTATION,
  SIMPLE,
}
