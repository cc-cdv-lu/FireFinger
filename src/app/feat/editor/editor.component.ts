import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  courseList: Array<Course> = [
    {
      id: 'Set id?',
      lessons: [],
      name: 'Some course 1',
      description: 'Bla bla bla',
    },
    {
      id: 'Set id?',
      lessons: [],
      name: 'testi test 1',
      description: 'Bla bla bla',
    },
    {
      id: 'Set id?',
      lessons: [],
      name: 'Wat',
      description: 'Bla bla bla',
    },
    {
      id: 'Set id?',
      lessons: [],
      name: 'Heyho',
      description: 'Bla bla bla',
    },
    {
      id: 'Set id?',
      lessons: [],
      name: 'POlopol',
      description: 'Bla bla bla',
    },
  ];
  loadedCourse: Course = undefined;

  constructor() {}

  ngOnInit() {}

  createCourse() {
    // TODO
    const newCourse = {
      id: 'Set id?',
      lessons: [],
      name: 'New course',
      description: 'Enter course description',
    };
    this.courseList.push(newCourse);
    this.loadedCourse = newCourse;
  }

  createLesson() {
    this.loadedCourse.lessons.push({
      description: 'Enter lesson description or leave empty',
      display: 'DEFAULT',
      id: 'Enter id?',
      name: 'Lesson name here',
      type: 'DEFAULT',
    });
  }

  loadCourse(courseId: string) {
    // TODO
  }

  loadLesson(courseId: string, lessonId: string) {
    // TODO
  }

  saveAll() {
    // TODO
  }
}
