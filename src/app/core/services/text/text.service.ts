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
  private text: string;
  private index: number = 0;

  private view: View = { prev: '', curr: '', next: '' };

  constructor() {
    this.updateView(0, 'Das Haus ist klein!');
  }

  /**
   * @returns The current progress in fraction (e.g. 0.3)
   */
  getProgress() {
    if (!this.text?.length || this.index) {
      return 0;
    }
    return this.index / this.text.length;
  }

  getView() {
    return this.view;
  }

  advance() {
    if (this.index < this.text.length) {
      this.updateView(this.index + 1, this.text);
    } else {
      console.warn('FINISHED');
      // TODO: FINISHED
    }
  }

  updateView(index: number, text: string) {
    // TODO: line end at Enter

    this.index = index;
    this.text = text;

    if (index > text.length) {
      console.warn('Reached end...');
      this.view.curr = '✓';
      this.view.prev = this.text;
    }

    this.view.prev = this.text.substring(0, index);
    this.view.curr = this.text[index];
    this.view.next = this.text.substr(this.index + 1, this.text.length);
    console.log('Advanced...', this.index, this.view);
  }
}
