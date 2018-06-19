import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverlayModule } from '@angular/cdk/overlay';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';


/* Custom components */
import { HomeComponent } from './components/home/home.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { LevelSelectionComponent } from './components/level-selection/level-selection.component';
import { SummaryComponent } from './components/summary/summary.component'

/* Custom Modules */
import { MaterialManagerModule } from './material-manager.module'

/* Custom Services */
import { SessionService } from './services/session.service';
import { LessonService } from './services/lesson.service';
import { StatisticsService } from './services/statistics.service';
import { StyleService } from './services/style.service';
import { UserService } from './services/user.service';
import { StringHelperService } from './services/string-helper.service';
import { ReaderService } from './services/reader.service';
import { SoundEffectService } from './services/sound-effect.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', "/translations.json");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    MainViewComponent,
    SettingsComponent,
    LoginComponent,
    LevelSelectionComponent,
    SummaryComponent
  ],
  imports: [
    MaterialManagerModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OverlayModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService,
    SessionService,
    LessonService,
    StyleService,
    StatisticsService,
    UserService,
    StringHelperService,
    ReaderService,
    SoundEffectService,
    SettingsComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [SettingsComponent, LoginComponent]
})
export class AppModule { }
