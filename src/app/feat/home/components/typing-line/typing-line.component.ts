import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  TextService,
  ConfigService,
  StatsService,
  SpeakService,
  StringHelperService,
  View,
  Style,
} from '@app/core';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-typing-line',
  templateUrl: './typing-line.component.html',
  styleUrls: ['./typing-line.component.scss'],
})
export class TypingLineComponent implements AfterViewInit {
  ngOnInit() {}

  @ViewChild(CharacterComponent) charComponent: CharacterComponent;

  // DEBUG: Change this
  isInputFocused = true;

  constructor(
    private textService: TextService,
    private configService: ConfigService,
    private statsService: StatsService,
    private speakService: SpeakService,
    private stringHelper: StringHelperService
  ) {}
  ngAfterViewInit() {
    this.charComponent.onTypingSuccess.subscribe((e) => {
      this.textService.advance();
      this.statsService.registerSuccess(e);
      this.speakService.playChar(
        this.getView().curr +
          this.stringHelper.getRestOfWord(
            this.textService.getText(),
            this.textService.getIndex()
          )
      );
    });

    this.focusInput();

    this.charComponent.onTypingError.subscribe((e) => {
      this.statsService.registerMistake(e);
    });
  }

  trySpeakWord() {
    const prev = this.getView().prev;
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

  focusInput() {
    const input = document.getElementById('inputLetter');
    if (input) {
      input.setAttribute('tabindex', '1');
      input.focus();
      console.log('Setting focus to input...');
    }
  }

  sayLine() {
    this.speakService.sayTTS(this.getView().curr + this.getView().next, 'de');
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
