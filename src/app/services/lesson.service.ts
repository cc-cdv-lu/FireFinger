import { Injectable } from '@angular/core';
import { FileService } from './file.service';

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
  DICATION,
}

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  lessons: Array<Lesson> = [];
  constructor(private fileService: FileService) {
    this.reload();

    /*
    try {
      // TODO find a way to import this in production
      this.docsURL = 'src/assets/lessons/';
      this.loadAllDirs();
    } catch (err) { console.log('Did not work...', err); }
    */
  }

  reload(): Array<Lesson> {
    this.lessons = [];
    return (this.lessons = this.fileService.loadAllDirs());
  }
}
