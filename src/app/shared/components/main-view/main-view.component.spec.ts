import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainViewComponent } from './main-view.component';
import {
  SessionService,
  ElectronService,
  StyleService,
  StatisticsService,
  UserService,
  ReaderService,
} from '../../../core';

import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MaterialManagerModule } from '../../material-manager.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainViewComponent', () => {
  let component: MainViewComponent;
  let fixture: ComponentFixture<MainViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainViewComponent],
      imports: [
        MaterialManagerModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        SessionService,
        ElectronService,
        MatDialog,
        StyleService,
        StatisticsService,
        UserService,
        TranslateService,
        ReaderService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
