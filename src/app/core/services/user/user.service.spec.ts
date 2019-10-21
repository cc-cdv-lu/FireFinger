import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import { ElectronService } from './electron.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, ElectronService],
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
