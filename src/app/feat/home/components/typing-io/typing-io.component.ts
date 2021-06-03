import { AfterViewInit, Component } from '@angular/core';
import { ConfigService, CourseService } from '@app/core';
import { QuickSettingsComponent } from '@app/shared/components/quick-settings/quick-settings.component';
import { PopoverController } from '@ionic/angular';
import { TypingService } from '../../services/typing/typing.service';

@Component({
  selector: 'app-typing-io',
  templateUrl: './typing-io.component.html',
  styleUrls: ['./typing-io.component.scss'],
})
export class TypingIoComponent implements AfterViewInit {
  ngAfterViewInit(): void {}
  constructor(
    private courseService: CourseService,
    private popoverController: PopoverController,
    public typingService: TypingService,
    private configService: ConfigService
  ) {}

  getDisplay() {
    return this.courseService.getCurrentLesson().display;
  }

  getStyle() {
    return this.configService.getStyle();
  }

  isReady() {
    return this.courseService.getCurrentCourse() !== undefined;
  }

  async openQuickSettings(event?: any) {
    const popover = await this.popoverController.create({
      component: QuickSettingsComponent,
      cssClass: 'my-custom-class',
      event: event,
      translucent: true,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
