import { TestBed, inject } from '@angular/core/testing';

import { StringHelperService } from './string-helper.service';

describe('StringHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringHelperService]
    });
  });

  it('should be created', inject([StringHelperService], (service: StringHelperService) => {
    expect(service).toBeTruthy();
  }));
});
