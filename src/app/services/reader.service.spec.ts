import { TestBed, inject } from '@angular/core/testing';

import { ReaderService } from './reader.service';
import { ElectronService } from './electron.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('ReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [ReaderService, ElectronService, TranslateService],
    });
  });

  it('should be created', inject([ReaderService], (service: ReaderService) => {
    expect(service).toBeTruthy();
  }));
});
