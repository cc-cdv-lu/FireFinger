class ColorScheme {
  current: string;
  prev: string;
  next: string;
  backgroundColor: string;

}
export class ColorSchemes {
  static default: ColorScheme = {
    backgroundColor: "white",
    current: 'black',
    prev: 'lightgray',
    next: 'lightgray'
  };

  static inverted: ColorScheme = {
    backgroundColor: "black",
    current: 'white',
    prev: 'darkgray',
    next: 'darkgray'
  }

  static limeAndRed: ColorScheme = {
    backgroundColor: "#03ff03",
    current: '#d50000',
    prev: '#aa422f',
    next: '#aa422f'
  }

  static yellowAndLime: ColorScheme = {
    backgroundColor: "yellow",
    current: 'lime',
    prev: 'lightgray',
    next: 'lightgray'
  }
};
