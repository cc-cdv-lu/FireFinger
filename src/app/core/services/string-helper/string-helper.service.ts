import { Injectable } from '@angular/core';
import { VIEW } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class StringHelperService {

  constructor() { }

  getCurrentChar(input: string, index: number) {
    if (!input) { return ''; }
    return input[index];
  }

  getPrevSegment(input: string, index: number, view: VIEW) {
    if (!input) { return ''; }
    switch (view) {
      case VIEW.CHAR: return '';
      case VIEW.WORD: return this.getBeginningOfWord(input, index);
      case VIEW.LINE: return this.getBeginningOfLine(input, index);
    }
    return '';
  }

  getNextSegment(input: string, index: number, view: VIEW) {
    if (!input) { return ''; }
    switch (view) {
      case VIEW.CHAR: return '';
      case VIEW.WORD: return this.getRestOfWord(input, index);
      case VIEW.LINE: return this.getRestOfLine(input, index);
    }
  }

  getBeginningOfWord(str: string, pos: number) {
    let output = '';
    if (str[pos] === '\n' || str[pos] === ' ') { return output; }

    for (let i = pos - 1; i >= 0; i--) {
      if (str[i] !== '\n' && str[i] !== ' ') {
        output = str[i] + output;
      } else {
        return output;
      }
    }
    return output;
  }

  getRestOfWord(str: string, pos: number) {
    let output = '';
    if (str[pos] === '\n' || str[pos] === ' ') { return output; }

    for (let i = pos + 1; i < str.length; i++) {
      if (str[i] !== '\n' && str[i] !== ' ') {
        output += str[i];
      } else {
        return output;
      }
    }
    return output;
  }

  getBeginningOfLine(str: string, pos: number) {
    if (str[pos - 1] === '\n') { return str[pos - 1]; }
    if (str[pos] === '\n') { return this.getBeginningOfLine(str, pos - 1) + str[pos - 1]; }

    let output = '';
    for (let i = pos - 1; i >= 0; i--) {
      if (str[i] !== '\n') {
        output = str[i] + output;
      } else { return output; }
    }

    return output;
  }

  getRestOfLine(str: string, pos: number) {
    let output = '';
    if (str[pos] === '\n') { return output; }
    for (let i = pos + 1; i < str.length; i++) {
      if (str[i] !== '\n') { output += str[i]; } else { return output; }
    }
    return output;
  }

  /* For reading out loud*/
  getWordAt(str: string, pos: number) {

    // Perform type conversions.
    str = String(str);
    // tslint:disable-next-line:no-bitwise
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    const left = str.slice(0, pos + 1).search(/\S+$/),
      right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);

  }

  shuffleString(str: string): string {
    const a = str.split(''),
      n = a.length;

    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join('');
  }

}
