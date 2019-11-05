import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryComponent } from './summary.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  UserService,
  SessionService,
  StyleService,
  ElectronService,
} from '../../core/index';

import { MaterialManagerModule } from '../../shared/material-manager.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      imports: [
        MaterialManagerModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        UserService,
        SessionService,
        TranslateService,
        StyleService,
        ElectronService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
