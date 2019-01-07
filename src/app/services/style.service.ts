import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

const FONT_KEY = 'FONT';
const THEME_KEY = 'THEME';
const WARNING_FLASH = 'WARNING_FLASH';

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  constructor(private electron: ElectronService) {}

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
    let f = this.electron.config.get(FONT_KEY);
    if (!f) {
      f = 20;
    }
    return f;
  }
  set font(v: number) {
    if (!v && !isNaN(v)) {
      return;
    }
    this.electron.config.set(FONT_KEY, v);
    document.documentElement.style.fontSize = v + 'px';
  }

  get warning_flash() {
    let c = this.electron.config.get(WARNING_FLASH);
    if (!c) {
      c = false;
    }
    return c;
  }
  set warning_flash(v: boolean) {
    if (v == null || v === undefined) {
      return;
    }
    this.electron.config.set(WARNING_FLASH, v);
  }

  get theme() {
    let t = this.electron.config.get(THEME_KEY);
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
    this.electron.config.set(THEME_KEY, t);
  }

  getThemes(): string {
    let output = '';
    for (const theme of this.themes) {
      output += theme.id;
    }
    return output;
  }
}
