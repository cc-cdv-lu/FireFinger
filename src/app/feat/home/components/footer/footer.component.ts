import { Component, OnInit } from '@angular/core';
import { StatsService, TextService } from 'src/app/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(
    private textService: TextService,
    private statsService: StatsService
  ) {}

  ngOnInit() {}

  getProgress() {
    return this.textService.getProgress();
  }

  getProgressText(): string {
    return Math.round(this.getProgress() * 100) + ' %';
  }

  getMistakeText(): string {
    return Math.round(this.statsService.getMistakeRatio() * 100) + '%';
  }
}
