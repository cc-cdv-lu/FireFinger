import { Injectable } from '@angular/core';
import { ConfigService, TextService, View } from '@app/core';

@Injectable()
export class TypingService {
  constructor(
    private textService: TextService,
    private configService: ConfigService
  ) {}

  trySpeakWord(view: View) {
    const prev = view.prev;
    if (
      prev.length === 0 ||
      prev[prev.length - 1] === ' ' ||
      prev[prev.length - 1] === '\n'
    ) {
      return this.textService.getCurrentWord();
    } else {
      return '';
    }
  }

  setFontSize(f: number) {
    if (f > 0) {
      this.configService.getStyle().fontSize = f;
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
