import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticsService } from '../../services/statistics.service';
import { StyleService } from '../../services/style.service';
import { SessionService } from '../../services/session.service';
import { MaterialManagerModule } from '../../material-manager.module';
import { MainViewComponent } from '../main-view/main-view.component';
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
      providers: [StatisticsService, StyleService, SessionService],
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
