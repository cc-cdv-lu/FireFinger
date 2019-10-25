import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';

import {
  StyleService,
  SessionService,
  StatisticsService,
  ElectronService,
} from '../core/services/index';

import { MainViewComponent } from '../shared/components/index';

import { MaterialManagerModule } from '../shared/material-manager.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, MainViewComponent],
      imports: [
        TranslateModule.forRoot(),
        MaterialManagerModule,
        RouterTestingModule,
      ],
      providers: [
        StatisticsService,
        StyleService,
        SessionService,
        ElectronService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*
  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
        'PAGES.HOME.TITLE'
    );
  }));
  */
});
