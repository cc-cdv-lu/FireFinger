import { Component, Input, OnInit } from '@angular/core';
import { Course, Lesson, LessonStats } from '@app/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  @Input() stats: LessonStats;
  @Input() isSuccess: boolean;
  @Input() lesson: Lesson;
  @Input() course: Course;
  @Input() lessonIndex: number;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async dismiss() {
    const modal = await this.modalController.getTop();
    modal.dismiss();
  }
}
