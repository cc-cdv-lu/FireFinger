import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonBrowserComponent } from './lesson-browser.component';

describe('LessonBrowserComponent', () => {
  let component: LessonBrowserComponent;
  let fixture: ComponentFixture<LessonBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
