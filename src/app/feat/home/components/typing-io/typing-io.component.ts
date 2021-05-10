import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  View,
  TextService,
  Style,
  StatsService,
  ConfigService,
} from 'src/app/core';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-typing-io',
  templateUrl: './typing-io.component.html',
  styleUrls: ['./typing-io.component.scss'],
})
export class TypingIoComponent implements AfterViewInit {
  @ViewChild(CharacterComponent) charComponent: CharacterComponent;

  // DEBUG: Change this
  isInputFocused = true;

  constructor(
    private textService: TextService,
    private configService: ConfigService,
    private statsService: StatsService
  ) {}
  ngAfterViewInit() {
    this.charComponent.onTypingSuccess.subscribe((e) => {
      this.textService.advance();
      this.statsService.registerSuccess(e);
    });

    this.charComponent.onTypingError.subscribe((e) => {
      this.statsService.registerMistake(e);
    });
  }

  getView(): View {
    return this.textService.getView();
  }

  getStyle(): Style {
    return this.configService.getStyle();
  }

  setFontSize(f: number) {
    if (f > 0) {
      this.getStyle().fontSize = f;
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
