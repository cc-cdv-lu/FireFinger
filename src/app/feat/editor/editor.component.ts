import { Component, OnInit } from '@angular/core';
import { Course, Lesson } from 'src/app/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  courseList: Array<Course> = [
    {
      id: 'Set 1',
      lessons: [],
      name: 'Some course 1',
      description: 'Bla bla bla',
    },
    {
      id: 'Set 2',
      lessons: [
        {
          description: 'Some description...',
          id: 'dfgdg',
          display: 'DEFAULT',
          type: 'DEFAULT',
          name: 'Some name.....',
          content:
            'ertertetetert jklasdföldsaf jasldkjfsadölfjaslkfjdas öfljköaslj',
        },
        {
          description: 'Some other description...',
          id: 'soowodo21',
          display: 'DEFAULT',
          type: 'DEFAULT',
          name: 'Some blupp',
          content: 'nbmvcnvncvbn jklasdföldsaf sdfsdfvxcvxcvxcvxcv öfljköaslj',
        },
        {
          description: 'More description...',
          id: 'xcvxcvxv',
          display: 'DEFAULT',
          type: 'DEFAULT',
          name: 'Some bla.....',
          content: 'asdf sdfsdfsdghgdfhfgh jasldkjfsadölfjaslkfjdas öfljköaslj',
        },
      ],
      name: 'testi test 1',
      description: 'Bla bla bla',
    },
    {
      id: 'Set 3',
      lessons: [],
      name: 'Wat',
      description: 'Bla bla bla',
    },
    {
      id: 'Set 4',
      lessons: [],
      name: 'Heyho',
      description: 'Bla bla bla',
    },
    {
      id: 'Set 5',
      lessons: [],
      name: 'POlopol',
      description: 'Bla bla bla',
    },
  ];
  loadedCourse: Course = undefined;
  loadedLesson: Lesson = undefined;

  constructor() {}

  ngOnInit() {
    this.loadedCourse = this.courseList[1];
  }

  debug() {
    console.log('Loaded course:', this.loadedCourse);
  }

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
      content: ''
    });
  }

  loadCourse(courseId: string) {
    // TODO
  }

  loadLesson(courseId: string, lessonId: string) {
    // TODO
    const course = this.courseList.find((course) => course.id === courseId);
    if (course) {
      const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
      if (lesson) {
        this.loadedLesson = lesson;
      }
    }
  }

  saveAll() {
    // TODO
  }

  compareWith(o1: Course, o2: Course | Course[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: Course) => u.id === o1.id);
    }

    return o1.id === o2.id;
  }
}
