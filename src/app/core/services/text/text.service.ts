import { Injectable } from '@angular/core';

export type View = {
  prev: string;
  curr: string;
  next: string;
};

@Injectable({
  providedIn: 'root',
})
export class TextService {
  // TODO: Serialize these two on save
  private text: string = '';
  private index: number = 0;

  private view: View = { prev: '', curr: '', next: '' };

  constructor() {
    this.updateView(
      0,
      `Tschüss, schönen Tag noch.
Schönes Wochenende.
Mach’s gut. Antwort: Mach’s besser. / Du auch.`
    );
  }

  /**
   * @returns The current progress in fraction (e.g. 0.3)
   */
  getProgress() {
    if (!this.text?.length || !this.index) {
      return 0;
    }
    return this.index / this.text.length;
  }

  getView() {
    return this.view;
  }

  advance() {
    const hasFinished = this.updateView(this.index + 1, this.text);
    if (hasFinished) {
      console.warn('FINISHED!');
    }
  }

  updateView(index: number, text: string): boolean {
    // TODO: line end at Enter

    this.index = index;
    this.text = text;

    if (index >= text.length) {
      console.warn('Reached end...');
      this.view.curr = '✓';
      this.view.prev = this.text;
      return true;
    }

    const startSplit = this.text.substring(0, index).split('\n');
    this.view.prev = startSplit[startSplit.length - 1];

    this.view.curr = this.text[index];

    const rest = this.text.substr(this.index + 1, this.text.length);
    if (this.view.curr === '\n') {
      this.view.next = '';
    } else {
      this.view.next = rest.split('\n')[0];
    }

    return false;
  }
}
