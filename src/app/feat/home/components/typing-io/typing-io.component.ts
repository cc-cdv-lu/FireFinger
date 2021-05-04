import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typing-io',
  templateUrl: './typing-io.component.html',
  styleUrls: ['./typing-io.component.scss'],
})
export class TypingIoComponent implements OnInit {
  view = {
    prev: 'das Haus i',
    curr: 's',
    next: 't ein sehr großes Haus',
    // next: 't ein sehr großes Haus mit viel Garten oder, keine Ahnung bin neu hier',
  };

  constructor() {}

  ngOnInit() {}
}
