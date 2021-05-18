import { Injectable } from '@angular/core';
import { Course } from '../../data.types';
import { FileService } from '../file/file.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private file: FileService) {}

  loadCourses(): Course[] {
    return undefined;
  }
}
