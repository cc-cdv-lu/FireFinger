import { Component, OnInit } from '@angular/core';
import { Config, ConfigService } from '@app/core/services';

@Component({
  selector: 'app-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss'],
})
export class QuickSettingsComponent implements OnInit {
  fonts = ['Comic Sans', 'Courier New', 'Schoulschreft', 'Arial'];

  maxFontSize = 100;
  savedConfig: string;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.updateSavedConfig();
  }

  getConfig() {
    return this.configService.getConfig();
  }

  saveConfig() {
    this.updateSavedConfig();
    return this.configService.saveConfig();
  }

  private updateSavedConfig() {
    this.savedConfig = JSON.stringify(this.getConfig());
  }

  hasChanges(): boolean {
    return JSON.stringify(this.getConfig()) !== this.savedConfig;
  }
}
