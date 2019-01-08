import { TestBed, inject } from '@angular/core/testing';

import { FileService } from './file.service';
import { ElectronService } from './electron.service';

describe('FileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileService, ElectronService],
    });
  });

  it('should be created', inject([FileService], (service: FileService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject(
    [ElectronService],
    (service: ElectronService) => {
      expect(service).toBeTruthy();
    }
  ));
});
