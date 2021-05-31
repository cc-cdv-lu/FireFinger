import { TestBed } from '@angular/core/testing';

import { StringHelperService } from './string-helper.service';

describe('StringHelperService', () => {
  let service: StringHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
