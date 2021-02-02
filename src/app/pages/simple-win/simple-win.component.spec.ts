import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleWinComponent } from './simple-win.component';

describe('SimpleWinComponent', () => {
  let component: SimpleWinComponent;
  let fixture: ComponentFixture<SimpleWinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleWinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
