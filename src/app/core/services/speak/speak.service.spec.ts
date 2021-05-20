import { TestBed } from '@angular/core/testing';

import { SpeakService } from './speak.service';

describe('SpeakService', () => {
  let service: SpeakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
