import { Component, EventEmitter, Input, Output } from '@angular/core';

type Typing = {
  expected: string;
  typed: string;
};

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent {
  @Input() character: string;
  @Output() typingOutput = new EventEmitter<Typing>();

  isCorrect = true;
  typed: string;
  constructor() {}

  keyEvent(event: KeyboardEvent) {

    // To trap focus here...
    if (event.key === 'Tab') {
      event.preventDefault();
    }

    // Ignores everything like Shift, Tab, Control, Dead, ...
    if (event.key.length > 1 && event.key !== 'Enter') {
      console.log('Should probably ignore this...', event.key);
      return;
    }
    this.typingOutput.emit({ expected: this.character, typed: event.key });
    this.isCorrect = event.key === this.character;
    console.log('Correct?', this.isCorrect, event.key);
  }

  displayCharacter(character: string) {
    switch (character) {
      case ' ': return '_';
      default: return character;
    }
  }
}
