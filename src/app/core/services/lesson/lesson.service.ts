import { Injectable } from '@angular/core';
import { FileService } from '../file/file.service';
import { Lesson } from '../type/type.service';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  lessons: Array<Lesson> = [];
  constructor(private fileService: FileService) {
    this.reload();
  }

  reload(): Array<Lesson> {
    this.lessons = [];
    return (this.lessons = this.fileService.loadAllDirs());
  }
}
