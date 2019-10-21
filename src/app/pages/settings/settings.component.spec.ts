import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { LessonService } from '../../services/lesson.service';
import { SessionService } from '../../services/session.service';
import { StyleService } from '../../services/style.service';
import { UserService } from '../../services/user.service';
import { StatisticsService } from '../../services/statistics.service';
import { ReaderService } from '../../services/reader.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ElectronService } from '../../services/electron.service';
import { FileService } from '../../services/file.service';
import { MaterialManagerModule } from '../../material-manager.module';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        MaterialManagerModule,
        TranslateModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        LessonService,
        SessionService,
        StyleService,
        UserService,
        StatisticsService,
        ReaderService,
        TranslateService,
        ElectronService,
        FileService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
