import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typing-io',
  templateUrl: './typing-io.component.html',
  styleUrls: ['./typing-io.component.scss'],
})
export class TypingIoComponent implements OnInit {
  view = {
    prev: 'das Haus ist',
    curr: ' ',
    next: 'ein sehr großes Haus',
    fontSize: 5,
    // next: 't ein sehr großes Haus mit viel Garten oder, keine Ahnung bin neu hier',
  };

  constructor() {}

  setFontSize(f: number) {
    if (f > 0) {
      this.view.fontSize = f;
    }
  }

  ngOnInit() {}

  specifyCharacter(character: string): string {
    switch (character.toLowerCase()) {
      case ' ':
        return 'SPACE';
      case 'ä':
      case 'ü':
      case 'ö':
        return 'Umlaut';
      case 'é':
      case 'è':
      case 'ê':
        return 'Accent';
    }
  }

}
