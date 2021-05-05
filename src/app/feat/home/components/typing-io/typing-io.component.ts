import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-typing-io',
  templateUrl: './typing-io.component.html',
  styleUrls: ['./typing-io.component.scss'],
})
export class TypingIoComponent implements AfterViewInit {
  @ViewChild(CharacterComponent) charComponent: CharacterComponent;
  view = {
    prev: 'das Haus ist',
    curr: ' ',
    next: 'ein sehr kleines Haus',
    fontSize: 5,
    // next: 't ein sehr großes Haus mit viel Garten oder, keine Ahnung bin neu hier',
  };

  constructor() {}
  ngAfterViewInit() {
    this.charComponent.onTypingSuccess.subscribe(() => {
      this.progressTemp();
    });
  }

  setFontSize(f: number) {
    if (f > 0) {
      this.view.fontSize = f;
    }
  }

  progressTemp() {
    this.view.prev += this.view.curr;
    this.view.curr = this.view.next[0];
    this.view.next = this.view.next.substr(1, this.view.next.length);
  }

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
