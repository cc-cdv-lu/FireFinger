import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ElectronService,
  UserService,
  StyleService,
  StatisticsService,
} from '../../core/services/index';

import { LoginComponent } from './login.component';
import { MaterialManagerModule } from '../../shared/material-manager.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MaterialManagerModule,
        TranslateModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        ElectronService,
        UserService,
        // Router,
        StyleService,
        StatisticsService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
