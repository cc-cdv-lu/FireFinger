import { Injectable } from '@angular/core';

enum VIEW {
  CHAR, WORD, LINE
}


@Injectable({
  providedIn: 'root'
})
export class StringHelperService {

  constructor() { }

  getCurrentChar(input, index) {
    if (!input) { return ''; }
    return input[index];
  }

  getPrevSegment(input, index, view: VIEW) {
    if (!input) { return ''; }
    switch (view) {
      case VIEW.CHAR: return '';
      case VIEW.WORD: return this.getBeginningOfWord(input, index);
      case VIEW.LINE: return this.getBeginningOfLine(input, index);
    }
    return '';
  }

  getNextSegment(input, index, view: VIEW) {
    if (!input) { return ''; }
    switch (view) {
      case VIEW.CHAR: return '';
      case VIEW.WORD: return this.getRestOfWord(input, index);
      case VIEW.LINE: return this.getRestOfLine(input, index);
    }
  }

  getBeginningOfWord(str, pos) {
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

  getRestOfWord(str, pos) {
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

  getBeginningOfLine(str, pos) {
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

  getRestOfLine(str, pos) {
    let output = '';
    if (str[pos] === '\n') { return output; }
    for (let i = pos + 1; i < str.length; i++) {
      if (str[i] !== '\n') { output += str[i]; } else { return output; }
    }
    return output;
  }

  /* For reading out loud*/
  getWordAt(str, pos) {

    // Perform type conversions.
    str = String(str);
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

  shuffleString(s: string): string {
    const a = s.split(''),
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
