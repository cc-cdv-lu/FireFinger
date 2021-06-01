import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  TextService,
  ConfigService,
  StatsService,
  SpeakService,
  StringHelperService,
  View,
  Style,
  CourseService,
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
    public typingService: TypingService,
    private courseService: CourseService
  ) {}
  ngAfterViewInit() {
    this.charComponent.onTypingSuccess.subscribe((e) => {
      this.textService.advance();
      this.statsService.registerSuccess(e);
      if (this.courseService.currentLesson.display !== 'character') {
        this.speakService.playChar(
          this.getView().curr +
            this.stringHelper.getRestOfWord(
              this.textService.getText(),
              this.textService.getIndex()
            )
        );
      } else {
        this.speakService.playChar(this.getView().curr);
      }
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
    switch (this.courseService.getCurrentLesson().display) {
      case 'character':
        return this.getCharView();
      case 'word':
        return this.getWordView();
      case 'line':
        return this.getLineView();
    }
    return this.textService.getView();
  }

  private getLineView(): View {
    return this.textService.getView();
  }

  private getWordView(): View {
    const view = this.textService.getView();
    if (view.curr === ' ' || view.curr === '\n') {
      return { prev: '', curr: view.curr, next: '' };
    }
    const regexp = new RegExp('[ \n]');
    console.log('Spliut:', view.next.split(regexp));
    view.next = view.next.split(regexp)[0];
    if (view.prev) {
      const prevSplit = view.prev.split(regexp);
      view.prev = prevSplit[prevSplit.length - 1];
    } else {
      view.prev = '';
    }

    return view;
  }

  private getCharView(): View {
    return { prev: '', curr: this.textService.getView().curr, next: '' };
  }

  getStyle(): Style {
    return this.configService.getStyle();
  }
}
