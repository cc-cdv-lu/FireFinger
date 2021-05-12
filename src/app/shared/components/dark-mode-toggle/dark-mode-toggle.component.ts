import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonToggle } from '@ionic/angular';

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss'],
})
export class DarkModeToggleComponent implements AfterViewInit {
  toggle: HTMLIonToggleElement;
  constructor() {}
  ngAfterViewInit() {
    // Query for the toggle that is used to change between themes
    const toggle: HTMLIonToggleElement = document.querySelector(
      '#darkModeToggle'
    );

    // Listen for the toggle check/uncheck to toggle the dark class on the <body>
    toggle.addEventListener('ionChange', (ev: CustomEvent) => {
      document.body.classList.toggle('dark', ev.detail.checked);
    });

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (e) => checkToggle(e.matches));

    // Called by the media query to check/uncheck the toggle
    function checkToggle(shouldCheck: boolean) {
      console.log('Toggle should be:', shouldCheck, prefersDark);
      toggle.checked = shouldCheck;
    }

    // Called once when the component loads
    function loadApp() {
      checkToggle(prefersDark.matches);
      document.body.classList.toggle('dark', prefersDark.matches);
    }

    loadApp();
  }
}
