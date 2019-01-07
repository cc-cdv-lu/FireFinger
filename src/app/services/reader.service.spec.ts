import { TestBed, inject } from '@angular/core/testing';

import { ReaderService } from './reader.service';
import { ElectronService } from './electron.service';
import { TranslateService } from '@ngx-translate/core';

describe('ReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReaderService, ElectronService, TranslateService],
    });
  });

  it('should be created', inject([ReaderService], (service: ReaderService) => {
    expect(service).toBeTruthy();
  }));
});
