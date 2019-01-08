import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryComponent } from './summary.component';
import { MaterialManagerModule } from '../../material-manager.module';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { StyleService } from '../../services/style.service';
import { ElectronService } from '../../services/electron.service';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      imports: [MaterialManagerModule, TranslateModule.forRoot()],
      providers: [UserService, SessionService, TranslateService, StyleService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
