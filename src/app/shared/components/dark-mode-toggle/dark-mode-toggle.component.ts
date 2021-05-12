import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss'],
})
export class DarkModeToggleComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    this.prepareDarkModeToggle();
  }

  prepareDarkModeToggle() {
    // Query for the toggle that is used to change between themes
    const toggle: HTMLIonToggleElement = document.querySelector('#themeToggle');

    // Listen for the toggle check/uncheck to toggle the dark class on the <body>
    toggle.addEventListener('ionChange', (ev: CustomEvent) => {
      document.body.classList.toggle('dark', ev.detail.checked);
    });

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((e) => checkToggle(e.matches));

    // Called when the app loads
    function loadApp() {
      checkToggle(prefersDark.matches);
    }

    // Called by the media query to check/uncheck the toggle
    function checkToggle(shouldCheck) {
      toggle.checked = shouldCheck;
    }
    loadApp();
  }
}
