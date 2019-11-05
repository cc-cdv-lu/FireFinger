import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTextsComponent } from './my-texts.component';
import {
  SessionService,
  ElectronService,
  StyleService,
  FileService,
} from '../../core/index';
import { MaterialManagerModule } from '../../shared/material-manager.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('LevelSelectionComponent', () => {
  let component: MyTextsComponent;
  let fixture: ComponentFixture<MyTextsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyTextsComponent],
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
    fixture = TestBed.createComponent(MyTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
