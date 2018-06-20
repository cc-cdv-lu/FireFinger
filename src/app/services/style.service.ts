import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';

export class ColorScheme {
  name: string;
  current: string;
  prev: string;
  next: string;
  backgroundColor: string;

}
const FONT_KEY = "FONT";
const THEME_KEY = "THEME";

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  constructor(private electron: ElectronService) {
    this.font = this.electron.config.get(FONT_KEY);
  }

  /* APPLICATION WIDE STYLE ADJUSTMENTS */
  increaseFont() {
    this.font++;
  }

  decreaseFont() {
    this.font--;
  }

  get font() {
    //let str = document.documentElement.style.fontSize.replace('px', "");
    let f = this.electron.config.get(FONT_KEY)
    if (!f) f = 20;
    return f;
  }
  set font(v: number) {
    if (!v) return;

    this.electron.config.set(FONT_KEY, v);
    document.documentElement.style.fontSize = v + 'px';
  }

  _theme = "default-theme";
  set theme(t: string) {
    this._theme = t;
    this.electron.config.set(THEME_KEY, this._theme);
  }
  get theme() {
    this._theme = this.electron.config.get(THEME_KEY);
    return this._theme;
  }

  themes = [
    {
      name: 'Light',
      id: 'light-theme'
    },
    {
      name: 'Dark',
      id: 'dark-theme'
    },
    {
      name: 'Default',
      id: 'default-theme'
    },
    {
      name: 'Black & Yellow',
      id: 'by-theme'
    }
  ]
  getThemes(): string {
    let output = "";
    for (let theme of this.themes) {
      output += (theme.id);
    }
    return output;
  }
}
