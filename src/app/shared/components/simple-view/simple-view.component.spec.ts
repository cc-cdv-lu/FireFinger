import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleViewComponent } from './simple-view.component';

describe('SimpleViewComponent', () => {
  let component: SimpleViewComponent;
  let fixture: ComponentFixture<SimpleViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
