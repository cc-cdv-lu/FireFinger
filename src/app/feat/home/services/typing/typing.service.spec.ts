import { TestBed } from '@angular/core/testing';

import { TypingService } from './typing.service';

describe('TypingService', () => {
  let service: TypingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
