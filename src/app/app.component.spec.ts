import { OverlayContainer } from '@angular/cdk/overlay';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { } from 'jasmine';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LevelSelectionComponent } from './components/level-selection/level-selection.component';
import { LoginComponent } from './components/login/login.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SummaryComponent } from './components/summary/summary.component';
import { MaterialManagerModule } from './material-manager.module';
import { ElectronService } from './services/electron.service';
import { StyleService } from './services/style.service';
import { UserService } from './services/user.service';
import { FormsModule } from '@angular/forms';



describe('AppComponent', () => {
  afterAll(() => {
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SettingsComponent,
        MainViewComponent,
        LoginComponent,
        LevelSelectionComponent,
        SummaryComponent,
        HomeComponent
      ],
      providers: [
        ElectronService,
        TranslateService,
        StyleService,
        UserService,
        OverlayContainer,
        SettingsComponent
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        MaterialManagerModule,
        FormsModule
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

class TranslateServiceStub {
  setDefaultLang(lang: string): void {}
}
