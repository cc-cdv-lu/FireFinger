import { TestBed, inject } from '@angular/core/testing';

import { KeyProcessorService } from './key-processor.service';

describe('KeyProcessorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyProcessorService]
    });
  });

  it('should be created', inject([KeyProcessorService], (service: KeyProcessorService) => {
    expect(service).toBeTruthy();
  }));
});
