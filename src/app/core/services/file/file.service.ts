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

import { courseList } from './default_courses';

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
    const exists1 = await this.folderOrFileExists(
      this.basePath.split('/')[0],
      this.dir
    );
    if (!exists1) {
      await Filesystem.mkdir({
        directory: this.dir,
        path: this.basePath.split('/')[0],
      });
    }
    const exists2 = await this.folderOrFileExists(this.basePath, this.dir);
    if (!exists2) {
      await Filesystem.mkdir({
        directory: this.dir,
        path: this.basePath,
      });
    }
  }

  async folderOrFileExists(
    path: string,
    dir: FilesystemDirectory
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      return Filesystem.stat({
        directory: dir,
        path: path,
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
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
    for (let courseFolder of contents.files) {
      const stat = await Filesystem.stat({
        directory: this.dir,
        path: `${this.basePath}/${courseFolder}`,
      });

      if (this.isFile(stat)) {
        continue;
      }

      // Read course
      let course: Course = DEFAULT_COURSE;
      // Check for metadata
      const metaDataFileExists = await this.folderOrFileExists(
        `${this.basePath}/${courseFolder}.ffc`,
        this.dir
      );

      if (metaDataFileExists) {
        const cMeta = await Filesystem.readFile({
          path: `${this.basePath}/${courseFolder}.ffc`,
          directory: this.dir,
        });
        course = JSON.parse(cMeta.data) as Course;
      } else {
        console.log('Meta not found for', course);
      }
      // Travers course data to gather lessons
      const lessonFiles = await Filesystem.readdir({
        path: `${this.basePath}/${courseFolder}`,
        directory: this.dir,
      });
      for (let lesson of lessonFiles.files) {
        const lessonStat = await Filesystem.stat({
          path: `${this.basePath}/${courseFolder}/${lesson}`,
          directory: this.dir,
        });

        if (this.isFile(lessonStat)) {
          // Check for metadata
          if (lesson.endsWith('.ffl') || lesson.endsWith('.txt')) {
            let newLesson: Lesson = DEFAULT_LESSON;
            const baseLessonFileName = lesson
              .replace('.ffl', '')
              .replace('.txt', '');
            const lessonBasePath = `${this.basePath}/${courseFolder}/${baseLessonFileName}`;
            const lMeta = await Filesystem.readFile({
              path: lessonBasePath + '.ffl',
              directory: this.dir,
            });
            if (lMeta) {
              newLesson = { ...(JSON.parse(lMeta.data) as Lesson) };
            }
            // Check for content data
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
    return output;
  }

  isDirectory(stat: StatResult) {
    return stat.type === 'directory';
  }

  isFile(stat: StatResult) {
    return stat.type === 'file';
  }

  saveCourses(courses: Course[]) {}

  async createDefaultCourses() {
    for (let course of courseList) {
      // Create course
      await Filesystem.mkdir({
        path: `${this.basePath}/${course.id}`,
        directory: this.dir,
      });
      // Should not write lesson metadata?
      // If it's included - importing much easier
      // If not regenerating give more consistency?
      await Filesystem.writeFile({
        path: `${this.basePath}/${course.id}.ffc`,
        directory: this.dir,
        encoding: FilesystemEncoding.UTF8,
        data: JSON.stringify(course),
      });

      for (let lesson of course.lessons) {
        let lessonPath = `${this.basePath}/${course.id}/${lesson.id}`;

        await Filesystem.writeFile({
          path: lessonPath + '.ffl',
          directory: this.dir,
          encoding: FilesystemEncoding.UTF8,
          data: JSON.stringify(lesson),
        });
        await Filesystem.writeFile({
          path: lessonPath + '.txt',
          directory: this.dir,
          encoding: FilesystemEncoding.UTF8,
          data: lesson.content,
        });
      }
    }
  }

  async deleteAllTheThings() {
    const results = await Filesystem.deleteFile({
      path: this.basePath,
      directory: this.dir,
    });
    console.log('Deleted all the files...', results);
    await this.prepare();
  }
}
