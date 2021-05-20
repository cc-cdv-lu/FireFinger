import { Injectable } from '@angular/core';
import {
  Filesystem,
  Directory,
  Encoding,
  StatResult,
} from '@capacitor/filesystem';
import {
  Course,
  DEFAULT_COURSE,
  DEFAULT_LESSON,
  Lesson,
} from '../../data.types';

import { courseList } from './default_courses';

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
  dir = Directory.Data;

  constructor() {
    this.prepare();
  }

  private async prepare() {
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

  private async folderOrFileExists(path: string, dir: Directory): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      return Filesystem.stat({
        directory: dir,
        path: path,
      })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  /**
   * Retrieves courses from file storage and returns it as an Array of course-ojbects
   */
  public async getCourses(): Promise<Course[]> {
    // TODO: Generate default data when no metadata is found (and save it?)
    await this.prepare();
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
          if (!lesson.endsWith('.ffl') && !lesson.endsWith('.txt')) {
            continue;
          }
          let newLesson: Lesson = DEFAULT_LESSON;
          const baseLessonFileName = lesson
            .replace('.ffl', '')
            .replace('.txt', '');
          // Skip if lesson has already been created (by metadata or by text file)
          if (course.lessons.find((l) => l.id === baseLessonFileName)) {
            continue;
          }
          const lessonBasePath = `${this.basePath}/${courseFolder}/${baseLessonFileName}`;

          // Load metadata for lesson
          if (this.folderOrFileExists(lessonBasePath + '.ffl', this.dir)) {
            const lMeta = await Filesystem.readFile({
              path: lessonBasePath + '.ffl',
              directory: this.dir,
            });
            if (lMeta) {
              newLesson = { ...(JSON.parse(lMeta.data) as Lesson) };
            }
          }
          // Check for content data
          if (this.folderOrFileExists(lessonBasePath + '.txt', this.dir)) {
            const lContent = await Filesystem.readFile({
              path: lessonBasePath + '.txt',
              directory: this.dir,
            });
            if (lContent) {
              newLesson.content = lContent.data;
            }
          }
          course.lessons.push(newLesson);
        }
      }
      output.push(course);
    }
    console.log('Loaded from file:', output);
    return output;
  }

  private isDirectory(stat: StatResult) {
    return stat.type === 'directory';
  }

  private isFile(stat: StatResult) {
    return stat.type === 'file';
  }

  /**
   * Overwrites all files with the contents of the given array. Deletes missing courses and lessons automatically.
   * Inface it deletes everything and creates new files and folders
   * @param courses Array of course-objects that should be saved
   */
  public async saveCourses(courses: Course[]) {
    console.log('Deleting everything before saving to file...', courses);
    await this.deleteAllTheThings();
    await this.prepare();
    for (let course of courses) {
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
        encoding: Encoding.UTF8,
        data: JSON.stringify(course),
      });

      for (let lesson of course.lessons) {
        let lessonPath = `${this.basePath}/${course.id}/${lesson.id}`;

        await Filesystem.writeFile({
          path: lessonPath + '.ffl',
          directory: this.dir,
          encoding: Encoding.UTF8,
          data: JSON.stringify(lesson),
        });
        await Filesystem.writeFile({
          path: lessonPath + '.txt',
          directory: this.dir,
          encoding: Encoding.UTF8,
          data: lesson.content,
        });
      }
    }
    console.log('Changes saved to file:', courses);
  }

  /**
   * Creates the default courses retrieved from the internal .ts file
   */
  public async createDefaultCourses() {
    console.log('Creating default courses:', courseList);
    await this.prepare();
    await this.saveCourses(courseList);
  }

  /**
   * Deletes every file and folder related to the saved courses
   */
  public async deleteAllTheThings() {
    await this.deleteFolder(this.basePath, this.dir);
    const check = await this.folderOrFileExists(this.basePath, this.dir);
    console.warn('Everything should be deleted now...', !check);
  }

  private async deleteFile(path: string, directory: Directory) {
    const exists = await this.folderOrFileExists(path, directory);
    if (!exists) return;
    await Filesystem.deleteFile({ path, directory });
  }
  private async deleteFolder(path: string, directory: Directory) {
    const exists = await this.folderOrFileExists(path, directory);
    if (!exists) return;

    const folder = await Filesystem.readdir({ path, directory });
    for (let entry of folder.files) {
      const entryPath = `${path}/${entry}`;
      const stat = await Filesystem.stat({ path: entryPath, directory });
      if (this.isFile(stat)) {
        await Filesystem.deleteFile({ path: entryPath, directory });
        continue;
      }
      if (this.isDirectory(stat)) {
        await this.deleteFolder(entryPath, directory);
        continue;
      }
    }

    const res = await Filesystem.deleteFile({ path, directory });
    const check = await this.folderOrFileExists(path, directory);
    console.log(`Folder ${path} should be deleted now: ${!check}`);
  }

  async importCourse() { }
  async importCourses() { }
  async exportCourse(course: Course) { }
  async exportCourses(courses: Course[]) { }
}
