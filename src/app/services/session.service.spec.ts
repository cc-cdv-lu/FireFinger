import { TestBed, inject } from '@angular/core/testing';

import { SessionService } from './session.service';
import { ElectronService } from './electron.service';
import { StatisticsService } from './statistics.service';
import { UserService } from './user.service';
import { StringHelperService } from './string-helper.service';
import { ReaderService } from './reader.service';
import { SoundEffectService } from './sound-effect.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        SessionService,
        ElectronService,
        StatisticsService,
        UserService,
        StringHelperService,
        ReaderService,
        SoundEffectService,
      ],
    });
  });

  it('should be created', inject(
    [SessionService],
    (service: SessionService) => {
      expect(service).toBeTruthy();
    }
  ));
});
