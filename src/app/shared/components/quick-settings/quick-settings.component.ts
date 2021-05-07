import { Component, NgZone, OnInit } from '@angular/core';
import { StyleService } from 'src/app/core';

@Component({
  selector: 'app-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss'],
})
export class QuickSettingsComponent implements OnInit {
  fonts = ['Comic Sans', 'Courier New', 'Schoulschreft', 'Arial'];

  fontSize = 15;

  constructor(public styleService: StyleService, private zone: NgZone) {}

  ngOnInit() {}

  updateSize(e: CustomEvent) {
    this.styleService.style.fontSize = e.detail.value;
  }

  updateFamily(e: CustomEvent) {
    this.styleService.style.fontFamily = e.detail.value;
  }
}
