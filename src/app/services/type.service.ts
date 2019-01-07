import { Injectable } from '@angular/core';


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
}
export enum ChapterType {
  CHAR,
  WORD,
  DICATION
}

export enum VIEW {
  CHAR,
  WORD,
  LINE
}


@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor() { }
}
