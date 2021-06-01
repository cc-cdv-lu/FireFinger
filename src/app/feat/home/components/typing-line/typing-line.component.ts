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
import { TypingService } from '../../services/typing/typing.service';
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
    private stringHelper: StringHelperService,
    public typingService: TypingService
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
}
