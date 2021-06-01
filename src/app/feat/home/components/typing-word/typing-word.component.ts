import { Component, OnInit } from '@angular/core';
import { TextService } from '@app/core';

@Component({
  selector: 'app-typing-word',
  templateUrl: './typing-word.component.html',
  styleUrls: ['./typing-word.component.scss'],
})
export class TypingWordComponent implements OnInit {
  constructor(private textService: TextService) {}

  ngOnInit() {}

  getView() {
    const view = this.textService.getView();
    view.next = view.next.split('[ \n]*')[0];
    const prevSplit = view.prev.split['[ \n]*'];
    view.prev = prevSplit[prevSplit.length - 1];

    return view;
  }
}
