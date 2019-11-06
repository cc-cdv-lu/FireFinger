import { TestBed } from '@angular/core/testing';

import { KeyHandlerService } from './key-handler.service';

describe('KeyHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyHandlerService = TestBed.get(KeyHandlerService);
    expect(service).toBeTruthy();
  });
});
