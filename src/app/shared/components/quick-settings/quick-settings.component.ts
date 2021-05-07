import { Component, OnInit } from '@angular/core';
import { StyleService } from 'src/app/core'

@Component({
  selector: 'app-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss'],
})
export class QuickSettingsComponent implements OnInit {

  fonts = ['Comic Sans', 'Courier New', 'Schoulschreft', 'Arial'];

  constructor(public styleService: StyleService) { }

  ngOnInit() {}

}
