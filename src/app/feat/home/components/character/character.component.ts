import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { emojisplosion, emojisplosions } from 'emojisplosion';

type Typing = {
  expected: string;
  typed: string;
};

const ignoreKeys = [
  'ContextMenu',
  'CapsLock',
  'Tab',
  'Insert',
  'Home',
  'PageUp',
  'PageDown',
  'Delete',
  'End',
  'Backspace',
  'Shift',
  'Control',
  'Alt',
  'AltGraph',
  'Meta',
  'Dead',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'NumLock',
];

const impossibleKeys = ['´', '`', 'ß', '�'];

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent implements AfterViewInit {
  @Input() character: string;
  @Output() typingOutput = new EventEmitter<Typing>();

  @Output() onTypingError = new EventEmitter<Typing>();
  @Output() onTypingSuccess = new EventEmitter<Typing>();

  @ViewChild('io') io: ElementRef;

  isCorrect = true;
  typed: string;
  constructor() {}
  ngAfterViewInit(): void {
    console.warn('CHILD:', this.io);
    this.onTypingSuccess.subscribe(() => {
      emojisplosion({
        // container: this.io.nativeElement,
        emojiCount: () => Math.random() * 45,
        emojis: ['🔥', '🤙', '👏', '🎆', '🎇', '✨', '🚀', '😀', '😊', '🎉'],
        physics: {
          framerate: 60,
          opacityDecay: 20,
        },
        position: () => ({
          x: innerWidth / 2 + (Math.random() * innerWidth) / 10,
          y: innerHeight / 2 + innerHeight / 5,
        }),
      });
    });
  }

  keyEvent(event: KeyboardEvent) {
    // To trap focus here...
    if (event.key === 'Tab') {
      event.preventDefault();
    }

    // Ignores everything like Shift, Tab, Control, Dead, ...
    if (ignoreKeys.includes(event.key)) {
      console.log('Should probably ignore this...', event.key);
      return;
    }
    if (event.key.length > 1 && event.key !== 'Enter') {
      console.log('Should probably ignore this...', event.key);
      return;
    }

    const typing = { expected: this.character, typed: event.key };
    this.typingOutput.emit(typing);
    this.isCorrect =
      this.typedCorrectly(typing) || impossibleKeys.includes(this.character);
    if (this.isCorrect) {
      this.onTypingSuccess.emit(typing);
    } else {
      this.onTypingError.emit(typing);
    }
    console.log('Correct?', this.isCorrect, typing);
  }

  typedCorrectly(data: Typing) {
    if (data.typed === data.expected) {
      return true;
    }
    switch (data.typed) {
      case 'Enter':
        return data.expected === '\n';
      case "'":
      case '`':
      case '´':
        if (
          data.expected === '’' ||
          data.expected === "'" ||
          data.expected === '`' ||
          data.expected === '´'
        )
          return true;
      case '"':
        if (data.expected === '„' || data.expected === '“') {
          return true;
        }
      default:
        return false;
    }
  }

  displayCharacter(character: string) {
    switch (character) {
      case ' ':
        return '_';
      case '\n':
        return '&#x21B2;';
      default:
        return character;
    }
  }
}
