import { TestBed, inject } from '@angular/core/testing';

import { SoundEffectService } from './sound-effect.service';

describe('SoundEffectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundEffectService]
    });
  });

  it('should be created', inject([SoundEffectService], (service: SoundEffectService) => {
    expect(service).toBeTruthy();
  }));
});
