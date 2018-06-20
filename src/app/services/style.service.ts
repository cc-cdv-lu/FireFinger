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
const COLOR_SCHEME_KEY = "CS_KEY";
const THEME_KEY = "THEME";
export enum SIZE {
  BIGGEST, BIGGER, BIG, DEFAULT, SMALL, SMALLER
}

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  constructor(private electron: ElectronService) {
    this.fontSize = this.electron.config.get(FONT_KEY);
    this.activeColorScheme = this.electron.config.get(COLOR_SCHEME_KEY);

    if (!this.fontSize) this.fontSize = 800;
    if (!this.activeColorScheme) this.activeColorScheme = this.colorSchemes[5];
  }



  /* APPLICATION WIDE STYLE ADJUSTMENTS */
  increaseFont() {
    let c = this.getFont() + 1;
    document.documentElement.style.fontSize = c + 'px';
  }

  decreaseFont() {
    let c = this.getFont() - 1;
    document.documentElement.style.fontSize = c + 'px';
  }

  getFont() {
    let str = document.documentElement.style.fontSize.replace('px', "");
    return parseInt(str);
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

  /*TODO delete all of this...*/
  private _fontSize: number = 800;
  get fontSize(): number {
    return this._fontSize;
  }
  set fontSize(n: number) {
    if (!n) return;
    this._fontSize = n;
    this.electron.config.set(FONT_KEY, n);
  }
  get activeColorScheme(): ColorScheme {
    return this._activeColorScheme;
  }
  set activeColorScheme(c: ColorScheme) {
    if (!c) return;
    this._activeColorScheme = c;
    this.electron.config.set(COLOR_SCHEME_KEY, c);
  }


  getFontSize(n: SIZE) {
    switch (n) {
      case SIZE.SMALLER: return this.fontSize / 12 + 'px';
      case SIZE.SMALL: return this.fontSize / 8 + 'px';
      case SIZE.DEFAULT: return this.fontSize / 6 + 'px';
      case SIZE.BIG: return this.fontSize / 4 + 'px';
      case SIZE.BIGGER: return this.fontSize / 2 + 'px';
      case SIZE.BIGGEST: return this.fontSize + 'px';
      default: {
        console.error("Undefined font size: ", n);
        return this.fontSize;
      }
    }
  }

  colorSchemes: Array<ColorScheme> = [
    {
      name: 'Default',
      backgroundColor: "white",
      current: 'black',
      prev: 'lightgray',
      next: 'lightgray'
    },
    {
      name: 'inverted',
      backgroundColor: "black",
      current: 'white',
      prev: 'darkgray',
      next: 'darkgray'
    },
    {
      name: 'Lime & Red',
      backgroundColor: "#03ff03",
      current: '#d50000',
      prev: '#aa422f',
      next: '#aa422f'
    },
    {
      name: 'Yellow & Lime',
      backgroundColor: "yellow",
      current: 'lime',
      prev: 'lightgray',
      next: 'lightgray'
    },
    {
      name: 'Yellow & Black',
      backgroundColor: "yellow",
      current: 'black',
      prev: 'darkgray',
      next: 'darkgray'
    },
    {
      name: 'Black & Yellow',
      backgroundColor: "black",
      current: 'yellow',
      prev: 'lightgray',
      next: 'lightgray'
    }
  ]
  _activeColorScheme: ColorScheme = this.colorSchemes[1];

}
