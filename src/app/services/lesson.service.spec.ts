import { TestBed, inject } from '@angular/core/testing';

import { LessonService } from './lesson.service';
import { FileService } from './file.service';
import { ElectronService } from './electron.service';

describe('LessonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LessonService, FileService, ElectronService]
    });
  });

  it('should be created', inject([LessonService], (service: LessonService) => {
    expect(service).toBeTruthy();
  }));
});
