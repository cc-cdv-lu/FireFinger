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
export class ColorSchemeService {
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
      name: 'limeAndRed',
      backgroundColor: "#03ff03",
      current: '#d50000',
      prev: '#aa422f',
      next: '#aa422f'
    },
    {
      name: 'yellowAndLime',
      backgroundColor: "yellow",
      current: 'lime',
      prev: 'lightgray',
      next: 'lightgray'
    }
  ]
  activeColorScheme: ColorScheme = this.colorSchemes[1];

  constructor() {
  }

  setActiveColorScheme(c: ColorScheme) {
    console.log("Updating color scheme to :", c)
    this.activeColorScheme = c;
  }
}
