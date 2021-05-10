import { Injectable } from '@angular/core';
import { Style } from '../data.types';

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  style: Style;

  constructor() {}

  getStyle(): Style {
    return this.style;
  }
}
