import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { View, TextService } from 'src/app/core';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-typing-io',
  templateUrl: './typing-io.component.html',
  styleUrls: ['./typing-io.component.scss'],
})
export class TypingIoComponent implements AfterViewInit {
  @ViewChild(CharacterComponent) charComponent: CharacterComponent;
  style = {
    fontSize: 5,
    fontFamily: 'Schoulschreft',
  };

  constructor(private textService: TextService) {}
  ngAfterViewInit() {
    this.charComponent.onTypingSuccess.subscribe(() => {
      this.textService.advance();
    });
  }

  getView(): View {
    return this.textService.getView();
  }

  setFontSize(f: number) {
    if (f > 0) {
      this.style.fontSize = f;
    }
  }

  specifyCharacter(character: string): string {
    let output = '';
    switch (character.toLowerCase()) {
      case ' ':
        output = 'SPACE';
        break;
      case 'ä':
      case 'ü':
      case 'ö':
        output = 'Umlaut';
        break;
      case 'é':
      case 'è':
      case 'ê':
        output = 'Accent';
        break;
    }
    if (character.toLowerCase() !== character) {
      output += '\n' + 'Major';
    }
    return output.trim();
  }
}
