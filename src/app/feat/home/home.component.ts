import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { QuickSettingsComponent } from 'src/app/shared/components/quick-settings/quick-settings.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

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
