import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LevelSelectionComponent } from './level-selection.component';
import {
  SessionService,
  ElectronService,
  StyleService,
  FileService,
} from '../../core';
import { MaterialManagerModule } from '../../shared/material-manager.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('LevelSelectionComponent', () => {
  let component: LevelSelectionComponent;
  let fixture: ComponentFixture<LevelSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LevelSelectionComponent],
      imports: [
        MaterialManagerModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        SessionService,
        StyleService,
        FileService,
        ElectronService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
