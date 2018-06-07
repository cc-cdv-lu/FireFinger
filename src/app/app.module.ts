import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';

/* Custom components */
import { HomeComponent } from './components/home/home.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';

/* Custom Modules */
import { MaterialManagerModule } from './material-manager.module'

/* Custom Services */
import { SessionService } from './services/session.service';
import { LessonService } from './services/lesson.service';
import { StatisticsService } from './services/statistics.service';
import { StyleService } from './services/style.service';
import { UserService } from './services/user.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    MainViewComponent,
    SettingsComponent,
    LoginComponent
  ],
  imports: [
    MaterialManagerModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    UserService
  ],
  bootstrap: [AppComponent],
  entryComponents: [SettingsComponent, LoginComponent]
})
export class AppModule { }
