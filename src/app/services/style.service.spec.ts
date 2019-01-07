import { TestBed, inject } from '@angular/core/testing';

import { StyleService } from './style.service';
import { ElectronService } from './electron.service';

describe('StyleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StyleService, ElectronService],
    });
  });

  it('should be created', inject([StyleService], (service: StyleService) => {
    expect(service).toBeTruthy();
  }));
});
