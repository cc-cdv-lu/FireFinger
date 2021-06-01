import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewRef,
} from '@angular/core';
import {
  ConfigService,
  SpeakService,
  StatsService,
  StringHelperService,
  TextService,
  View,
} from '@app/core';
import { TypingService } from '../../services/typing/typing.service';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-typing-word',
  templateUrl: './typing-word.component.html',
  styleUrls: ['./typing-word.component.scss'],
})
export class TypingWordComponent implements AfterViewInit {
  @ViewChild(CharacterComponent) charComponent: CharacterComponent;
  constructor(
    private textService: TextService,
    public typingService: TypingService,
    private configService: ConfigService,
    private statsService: StatsService,
    private speakService: SpeakService,
    private stringHelper: StringHelperService
  ) {}
  ngAfterViewInit(): void {
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
  }

  getView(): View {
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

  getStyle() {
    return this.configService.getStyle();
  }
}
