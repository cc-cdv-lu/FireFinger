import { Injectable } from '@angular/core';
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
  StatResult,
} from '@capacitor/core';
import {
  Course,
  DEFAULT_COURSE,
  DEFAULT_LESSON,
  Lesson,
} from '../../data.types';

const { Filesystem } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /*   Folder structure
  BASE PATH/docs/courses or similar
  course1.ffc       <- Course metadata
  course1/
    lesson1.txt
    lesson1.ffl
    lesson2.txt     <- Lesson content
    lesson2.ffl     <- Lesson metadata
  course2/
  course3/
  course4/
  */

  basePath: string = 'FireFinger/docs';
  dir = FilesystemDirectory.Data;

  constructor() {
    this.prepare();
  }

  async prepare() {
    // Check if default folder structure exists
    // else create default structure (FireFinger/docs)
    // And also default courses?
    const stat = await Filesystem.stat({
      directory: this.dir,
      path: this.basePath,
    });
    if (!stat) {
      await Filesystem.mkdir({
        directory: this.dir,
        path: 'FireFinger',
      });
      await Filesystem.mkdir({
        directory: this.dir,
        path: this.basePath,
      });
    }
  }

  async loadCourses(): Promise<Course[]> {
    // TODO: instead search for folders and then their corresponding metadata files
    // Generate default data when no metadata is found (and save it?)
    let output: Course[] = [];
    // Search for metadata file in courses
    const contents = await Filesystem.readdir({
      path: this.basePath,
      directory: this.dir,
    });
    console.log(contents);
    for (let file of contents.files) {
      const stat = await Filesystem.stat({
        directory: this.dir,
        path: file,
      });

      // Read course
      if (this.isDirectory(stat)) {
        let course: Course = DEFAULT_COURSE;
        // Check for metadata
        const cMeta = await Filesystem.readFile({
          path: this.basePath + file + '.ffc',
        });
        if (cMeta) {
          course = JSON.parse(cMeta.data) as Course;
        }
        // Travers course data to gather lessons
        const lessonFiles = await Filesystem.readdir({
          path: this.basePath + file,
          directory: this.dir,
        });
        for (let lesson of lessonFiles.files) {
          const lessonStat = await Filesystem.stat({
            path: this.basePath + file + lesson,
            directory: this.dir,
          });

          if (!this.isDirectory(lessonStat)) {
            // Check for metadata and content data
            if (lesson.endsWith('.ffl') || lesson.endsWith('.txt')) {
              let newLesson: Lesson = DEFAULT_LESSON;
              const lessonBasePath =
                this.basePath +
                file +
                lesson.replace('.ffc', '').replace('.txt', '');
              const lMeta = await Filesystem.readFile({
                path: lessonBasePath + '.ffl',
                directory: this.dir,
              });
              if (lMeta) {
                newLesson = { ...(JSON.parse(lMeta.data) as Lesson) };
              }

              const lContent = await Filesystem.readFile({
                path: lessonBasePath + '.txt',
                directory: this.dir,
              });
              if (lContent) {
                newLesson.content = lContent.data;
              }
              course.lessons.push(newLesson);
            }
          }
        }
        output.push(course);
      }
    }

    return output;
  }

  isDirectory(stat: StatResult) {
    return stat.type === 'Directory';
  }

  saveCourses(courses: Course[]) {}

  createDefaultCourses() {}

  async deleteAllTheThings() {
    await Filesystem.deleteFile({ path: this.basePath, directory: this.dir });
  }
}
