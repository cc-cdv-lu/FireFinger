import { Injectable } from '@angular/core';
export class ColorScheme {
  name: string;
  current: string;
  prev: string;
  next: string;
  backgroundColor: string;

}
@Injectable({
  providedIn: 'root'
})
export class StyleService {
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


  fontSize = 800;
  getFormattedFontSize() {
    return this.fontSize + "px";
  }
  getFormattedWarningSize() {
    return this.fontSize / 8 + "px";
  }
  constructor() {
  }

  setActiveColorScheme(c: ColorScheme) {
    this.activeColorScheme = c;
  }
}
