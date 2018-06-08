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

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor(private electron: ElectronService) {
    this.fontSize = this.electron.config.get(FONT_KEY);
    this.activeColorScheme = this.electron.config.get(COLOR_SCHEME_KEY);

    if (!this.fontSize) this.fontSize = 800;
    if (!this.activeColorScheme) this.activeColorScheme = this.colorSchemes[1];
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
  activeColorScheme: ColorScheme = this.colorSchemes[1];

  getFormattedFontSize() {
    return this.fontSize + "px";
  }
  getFormattedWarningSize() {
    return this.fontSize / 8 + "px";
  }

  private _fontSize: number = 800;
  get fontSize(): number {
    return this._fontSize;
  }
  set fontSize(n: number) {
    if (!n) return;
    this._fontSize = n;
    console.log("Set font size to: ", n)
    this.electron.config.set(FONT_KEY, n);
  }

  setActiveColorScheme(c: ColorScheme) {
    this.activeColorScheme = c;
  }
}
