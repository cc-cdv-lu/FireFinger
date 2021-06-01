import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringHelperService {
  constructor() {}

  getCurrentChar(input: string, index: number) {
    if (!input) {
      return '';
    }
    return input[index];
  }

  getPrevSegment(input: string, index: number, displayType: string) {
    if (!input) {
      return '';
    }
    switch (displayType) {
      case 'DEFAULT':
      default:
        return this.getBeginningOfWord(input, index);
      /*
      case ChapterType.CHAR:
        return '';
      case ChapterType.WORD:
      case ChapterType.SIMPLE:
        return this.getBeginningOfWord(input, index);
      case ChapterType.DICTATION:
        return this.getBeginningOfLine(input, index);
      */
    }
  }

  getNextSegment(input: string, index: number, displayType: string) {
    if (!input) {
      return '';
    }
    switch (displayType) {
      case 'DEFAULT':
      default:
        return this.getBeginningOfWord(input, index);
      /*
      case ChapterType.CHAR:
        return '';
      case ChapterType.WORD:
      case ChapterType.SIMPLE:
        return this.getRestOfWord(input, index);
      case ChapterType.DICTATION:
        return this.getRestOfLine(input, index);
        */
    }
  }

  private getBeginningOfWord(str: string, pos: number) {
    let output = '';
    if (str[pos] === '\n' || str[pos] === ' ') {
      return output;
    }

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
    if (str[pos] === '\n' || str[pos] === ' ') {
      return output;
    }

    for (let i = pos + 1; i < str.length; i++) {
      if (str[i] !== '\n' && str[i] !== ' ') {
        output += str[i];
      } else {
        return output;
      }
    }
    return output;
  }

  private getBeginningOfLine(str: string, pos: number) {
    if (str[pos - 1] === '\n') {
      return str[pos - 1];
    }
    if (str[pos] === '\n') {
      return this.getBeginningOfLine(str, pos - 1) + str[pos - 1];
    }

    let output = '';
    for (let i = pos - 1; i >= 0; i--) {
      if (str[i] !== '\n') {
        output = str[i] + output;
      } else {
        return output;
      }
    }

    return output;
  }

  private getRestOfLine(str: string, pos: number) {
    let output = '';
    if (str[pos] === '\n') {
      return output;
    }
    for (let i = pos + 1; i < str.length; i++) {
      if (str[i] !== '\n') {
        output += str[i];
      } else {
        return output;
      }
    }
    return output;
  }

  /* For reading out loud*/
  public getWordAt(str: string, pos: number) {
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

  shuffleWords(str: string): string {
    const regexp = new RegExp('[ \n]*');
    const a = str.split(regexp),
      n = a.length;

    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp
    }
    return a.join('');
  }
}
