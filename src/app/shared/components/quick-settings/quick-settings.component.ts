import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/core/services';

@Component({
  selector: 'app-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss'],
})
export class QuickSettingsComponent implements OnInit {
  fonts = ['Comic Sans', 'Courier New', 'Schoulschreft', 'Arial'];

  maxFontSize = 100;

  constructor(private configService: ConfigService) {}

  ngOnInit() {}

  getConfig() {
    return this.configService.getConfig();
  }

  saveConfig() {
    return this.configService.saveConfig();
  }

  updateSize(e: CustomEvent) {
    this.configService.getStyle().fontSize = e.detail.value;
  }

  updateFamily(e: CustomEvent) {
    this.configService.getStyle().fontFamily = e.detail.value;
  }
}
