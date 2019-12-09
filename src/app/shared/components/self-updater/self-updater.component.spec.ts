import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfUpdaterComponent } from './self-updater.component';

describe('SelfUpdaterComponent', () => {
  let component: SelfUpdaterComponent;
  let fixture: ComponentFixture<SelfUpdaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfUpdaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
