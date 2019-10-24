import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

const FONT_KEY = 'FONT';
const FONT_FAMILY_KEY = 'FONT_FAMILY';
const THEME_KEY = 'THEME';
const WARNING_FLASH = 'WARNING_FLASH';
const HIDE_FOCUS = 'HIDE_FOCUS';

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  constructor(private electron: ElectronService) {}

  fontFamilies = [
    'Verdana',
    'Roboto',
    'Helvetica Neue',
    'Courier New',
    'Times New Roman',
    'Arial',
    'Arial Black',
  ];
  themes = [
    /*
    {
      name: 'Dark',
      id: 'dark-theme'
    },
    {
      name: 'Default',
      id: 'default-theme'
    },*/
    {
      name: 'Light',
      id: 'light-theme',
    },
    {
      name: 'Pink',
      id: 'pink-theme',
    },
    {
      name: 'Blue & Yellow',
      id: 'by-theme',
    },
    {
      name: 'True Black',
      id: 'true-black-theme',
    },
    {
      name: 'Dark lime',
      id: 'dl-theme',
    },
  ];

  /* APPLICATION WIDE STYLE ADJUSTMENTS */
  increaseFont() {
    this.font++;
  }

  decreaseFont() {
    this.font--;
  }

  get font() {
    let f = 10;
    if (this.electron.config) {
      f = this.electron.config.get(FONT_KEY);
    }

    if (!f) {
      f = 20;
    }
    return f;
  }
  set font(v: number) {
    if (!v && !isNaN(v)) {
      return;
    }
    if (this.electron.config) {
      this.electron.config.set(FONT_KEY, v);
    }
    document.documentElement.style.fontSize = v + 'px';
  }

  get warning_flash() {
    let c: any;
    if (this.electron.config) {
      c = this.electron.config.get(WARNING_FLASH);
    }
    if (c === undefined) {
      c = false;
    }
    return c;
  }
  set warning_flash(v: boolean) {
    if (v == null || v === undefined) {
      return;
    }
    if (this.electron.config) {
      this.electron.config.set(WARNING_FLASH, v);
    }
  }

  get font_family() {
    let c: any;
    if (this.electron.config) {
      c = this.electron.config.get(FONT_FAMILY_KEY);
    }
    if (c === undefined) {
      c = this.fontFamilies[0];
    }
    return c;
  }
  set font_family(v: string) {
    console.log('Setting font family...');
    if (v === null || v === undefined) {
      return;
    }
    if (this.electron.config) {
      this.electron.config.set(FONT_FAMILY_KEY, v);
      console.log('Font family set...');
    }
  }

  get hide_focus() {
    let c: any;
    if (this.electron.config) {
      c = this.electron.config.get(HIDE_FOCUS);
    }
    if (c === undefined) {
      c = true;
    }
    return c;
  }
  set hide_focus(v: boolean) {
    if (v == null || v === undefined) {
      return;
    }
    if (this.electron.config) {
      this.electron.config.set(HIDE_FOCUS, v);
    }
  }

  get theme() {
    let t: any;

    if (this.electron.config) {
      t = this.electron.config.get(THEME_KEY);
    }
    if (!t) {
      t = 'by-theme';
      this.theme = t;
    }
    return t;
  }
  set theme(t: string) {
    if (!t) {
      return;
    }
    if (this.electron.config) {
      this.electron.config.set(THEME_KEY, t);
    }
  }

  getThemes(): string {
    let output = '';
    for (const theme of this.themes) {
      output += theme.id;
    }
    return output;
  }
}
