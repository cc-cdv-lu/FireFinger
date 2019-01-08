import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ElectronService } from '../../services/electron.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { StyleService } from '../../services/style.service';
import { StatisticsService } from '../../services/statistics.service';
import { MaterialManagerModule } from '../../material-manager.module';
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
        BrowserAnimationsModule
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
