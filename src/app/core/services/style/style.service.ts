import { Injectable } from '@angular/core';

export type Style = {
  fontSize: number;
  fontFamily: string;
};

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  style: Style;

  constructor() {
    this.style = {
      fontSize: 5,
      fontFamily: 'Schoulschreft',
    };
  }

  getStyle(): Style {
    return this.style;
  }
}
