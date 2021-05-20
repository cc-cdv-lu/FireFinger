import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/core';
import { FileService } from 'src/app/core/services/file/file.service';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
})
export class ChaptersComponent implements OnInit {

  constructor(private fileService: FileService) { }

  courses: Course[];

  ngOnInit() { }

  async reload() {
    this.courses = await this.fileService.loadCourses();
  }

}
