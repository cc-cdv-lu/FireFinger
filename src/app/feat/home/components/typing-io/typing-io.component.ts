import { AfterViewInit, Component } from '@angular/core';
import { CourseService } from '@app/core';

@Component({
  selector: 'app-typing-io',
  templateUrl: './typing-io.component.html',
  styleUrls: ['./typing-io.component.scss'],
})
export class TypingIoComponent implements AfterViewInit {
  ngAfterViewInit(): void {}
  constructor(private courseService: CourseService) {}

  getDisplay() {
    return this.courseService.getCurrentLesson().display;
  }

  isReady() {
    return this.courseService.getCurrentCourse() !== undefined;
  }
}
