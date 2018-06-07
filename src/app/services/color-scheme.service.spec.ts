import { TestBed, inject } from '@angular/core/testing';

import { ColorSchemeService } from './color-scheme.service';

describe('ColorSchemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorSchemeService]
    });
  });

  it('should be created', inject([ColorSchemeService], (service: ColorSchemeService) => {
    expect(service).toBeTruthy();
  }));
});
