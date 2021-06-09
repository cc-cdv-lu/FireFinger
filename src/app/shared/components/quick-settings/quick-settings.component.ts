import { Component, OnInit } from '@angular/core';
import { Config, ConfigService, SpeakService } from '@app/core/services';

@Component({
  selector: 'app-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss'],
})
export class QuickSettingsComponent implements OnInit {
  fonts = ['Comic Sans', 'Courier New', 'Schoulschreft', 'Arial'];

  maxFontSize = 100;
  savedConfig: string;

  constructor(private configService: ConfigService, private speakService: SpeakService) {}

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

  ttsTest() {
    const text = 'Das ist ein Test';
    this.speakService.play(text);
  }

  private updateSavedConfig() {
    this.savedConfig = JSON.stringify(this.getConfig());
  }

  hasChanges(): boolean {
    return JSON.stringify(this.getConfig()) !== this.savedConfig;
  }
}
