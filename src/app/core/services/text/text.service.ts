import { EventEmitter, Injectable, Output } from '@angular/core';

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

  @Output() onTextChanged = new EventEmitter<string>();
  @Output() onTextFinished = new EventEmitter();
  @Output() onNextCharacter = new EventEmitter();

  /** TODO:
   * The current chapter and lesson need to be known
   * -> After a lesson is done, it should be saved to the user as Completed Lesson
   * This should be viewable in the chapter selection
   */

  private view: View = { prev: '', curr: '', next: '' };

  constructor() {
    this.setText(
      `Tschüss, schönen Tag noch.\n` +
        `Schönes Wochenende.\n` +
        `Mach’s gut. Antwort: Mach’s besser. / Du auch.`
    );
  }

  /**
   * @returns The current progress in fraction (e.g. 0.3)
   */
  getProgress(): number {
    if (!this.text?.length || !this.index) {
      return 0;
    }
    return this.index / this.text.length;
  }

  getView() {
    return this.view;
  }

  /**
   * Advances to next character
   */
  advance() {
    this.setIndex(++this.index);
    const hasFinished = this.updateView();
    if (hasFinished) {
      console.warn('FINISHED!');
    }
    this.onNextCharacter.emit(this.text[this.index]);
  }

  /**
   * Updates the text used by the text service and sets the index back to 0. This should be called before setting the index
   * @param text
   */
  public setText(text: string) {
    if (text !== this.text) {
      this.onTextChanged.emit(text);
    }
    this.text = text;
    this.index = 0;

    this.updateView();
  }

  public setIndex(i: number) {
    this.index = i;
    this.updateView();
  }

  /**
   * Updates the view and
   * @returns hasFinished as a boolean
   */
  private updateView(): boolean {
    if (this.index >= this.text.length) {
      console.warn('Reached end...');
      this.view.curr = '✓';
      this.view.prev = this.text;
      this.onTextFinished.emit();
      return true;
    }

    const startSplit = this.text.substring(0, this.index).split('\n');
    this.view.prev = startSplit[startSplit.length - 1];

    this.view.curr = this.text[this.index];

    const rest = this.text.substr(this.index + 1, this.text.length);
    if (this.view.curr === '\n') {
      this.view.next = '';
    } else {
      this.view.next = rest.split('\n')[0];
    }

    return false;
  }
}
