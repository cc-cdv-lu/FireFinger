import { Component, OnInit } from '@angular/core';
import { Course, Lesson, CourseService, FileService } from '@app/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  loadedCourse: Course = undefined;
  loadedLesson: Lesson = undefined;
  courseList: Course[];
  private savedContent: Course[];

  lessonTypes = [
    { title: 'Random words', id: 'shuffled_words' },
    { title: 'Random characters', id: 'shuffled_characters' },
    { title: 'Standard', id: 'static' }, // aka static
  ];
  lessonDisplays = [
    { title: 'Single character', id: 'character' },
    { title: 'Single words', id: 'word' },
    { title: 'Single line', id: 'line' },
    { title: 'Multiple lines', id: 'multiple_lines' },
    { title: 'Image', id: 'image' },
  ];
  lessonLanguages = [
    { title: 'German', id: 'de' },
    { title: 'French', id: 'fr' },
    { title: 'English', id: 'en' },
  ];

  constructor(
    private couresService: CourseService,
    private fileService: FileService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadAllFromFile();
  }

  debug() {
    console.log('Loaded course:', this.loadedCourse);
  }

  /* File related */

  /**
   * Loads all courses from file
   */
  async loadAllFromFile() {
    this.courseList = await this.couresService.getCourses();
    this.savedContent = JSON.parse(JSON.stringify(this.courseList)) as Course[];
    if (this.courseList.length > 0) {
      this.loadedCourse = this.courseList[0];
    } else {
      this.loadedCourse = undefined;
    }
  }

  /**
   * Creates default courses and loads their content
   */
  async createDefaultCourses() {
    await this.fileService.createDefaultCourses();
    await this.loadAllFromFile();
  }

  /**
   * Deletes everything
   */
  async deleteAllTheThings() {
    await this.fileService.deleteAllTheThings();
    await this.loadAllFromFile();
  }

  /**
   * Saves everything to file
   */
  async saveAllToFile() {
    const loading = await this.loadingController.create({
      message: 'Saving changes, please wait...',
      showBackdrop: true,
      duration: 120000,
    });
    await loading.present();
    await this.fileService.saveCourses(this.courseList);
    this.savedContent = JSON.parse(JSON.stringify(this.courseList)) as Course[];
    await loading.dismiss();
  }

  // Other

  /**
   * Compares current changes to saved version
   * @returns true if there are changes
   */
  hasChanges(): boolean {
    return (
      JSON.stringify(this.courseList) !== JSON.stringify(this.savedContent)
    );
  }

  /**
   * Creates new course with default values
   */
  createCourse() {
    const newCourse = {
      id: 'courseID-' + Date.now(),
      lessons: [],
      name: 'New course',
      description: 'Enter course description',
    };
    this.courseList.push(newCourse);
    this.loadedCourse = newCourse;
  }

  /**
   * Creates new lesson for the current course with default values
   */
  createLesson() {
    const newLesson = {
      description: 'Enter lesson description or leave empty',
      display: 'line',
      id: 'lessonID-' + Date.now(),
      name: 'New lesson',
      type: 'static',
      iterations: 15,
      content: '',
    } as Lesson;
    this.loadedCourse.lessons.push(newLesson);
    this.loadedLesson = newLesson;
  }

  /**
   * Loads course at the given index
   * @param courseId index of course
   */
  loadCourse(courseId: string) {
    const course = this.courseList.find((course) => course.id === courseId);
    if (course) {
      this.loadedCourse = course;
    }
  }

  /**
   * Loads the specified lesson
   * @param courseId index of course
   * @param lessonId index of lesson
   */
  loadLesson(courseId: string, lessonId: string) {
    const course = this.courseList.find((course) => course.id === courseId);
    if (course) {
      // this.loadedCourse = course;
      const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
      if (lesson) {
        this.loadedLesson = lesson;
      }
    }
  }

  /**
   * Deletes course at the given index
   * @param courseId index of course
   */
  async deleteCourse(courseId: string) {
    const index = this.courseList.findIndex((course) => course.id === courseId);
    const alert = await this.alertController.create({
      header: 'Deleting course',
      subHeader: this.courseList[index].name,
      message: 'Are you sure you want to delete this course?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return;
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            if (index >= 0) {
              this.courseList.splice(index, 1);
            }
            if (this.courseList.length > 0) {
              this.loadedCourse = this.courseList[0];
            }
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Deletes lesson in currently loaded course at the given index
   * @param lessonId index of lesson
   */
  async deleteLesson(lessonId: string) {
    const index = this.loadedCourse.lessons.findIndex(
      (lesson) => lesson.id === lessonId
    );

    const alert = await this.alertController.create({
      header: 'Deleting lesson',
      subHeader: this.loadedCourse.lessons[index].name,
      message: 'Are you sure you want to delete this lesson?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return;
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            if (index >= 0) {
              this.loadedCourse.lessons.splice(index, 1);
            }
            this.loadedLesson = undefined;
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Exports courses as ff-file that can be downloaded
   */
  async exportCourses() {
    await this.saveAllToFile();
    const data = JSON.stringify({ courses: this.courseList });
    this.createDownload('courses.ff', data);
  }

  /**
   * Creates URL that opens the default Mail program via a prefilled e-mail containing the all courses with all the lessons
   */
  getMailTo() {
    let mailTo = `mailto:julien.hoffmann@cc-cdv.lu?subject=FireFinger%20Cours&body=Hei%20meng%20Couren%20vum%20FireFinger%3A%0D%0A%0D%0A${encodeURI(
      JSON.stringify(this.courseList)
    )}`;

    console.log('Sending mail to:', { mailTo });

    return mailTo;
  }

  /**
   * Handle selected file to be imported as course
   * @param event Ion-Input chose file event
   */
  chooseFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.addEventListener('load', (event) => {
      const result = JSON.parse(reader.result as string);
      const courses = result.courses as Course[];

      // TODO: Generate default data when no metadata is found (and save it?)
      this.courseList = this.courseList.concat(courses);
      if (this.courseList.length > 0) {
        this.loadedCourse = this.courseList[0];
      }
      this.saveAllToFile();
    });
  }

  async uploadImage(event) {
    const file = event.target.files[0];
    let base64 = await this.getBase64(file);
    base64 = this.resizeBase64Image(base64, 400, 350);
    if (base64) {
      this.loadedLesson.imgSrc = base64;
    }
  }

  private getBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  private resizeBase64Image(
    base64Str: string,
    maxWidth: number = 400,
    maxHeight: number = 350
  ) {
    const img = new Image();
    img.src = base64Str;
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL();
  }

  /**
   * Creates a text file and triggers the download
   * @param filename What downloaded file should be called
   * @param text Contents of downloaded file
   */
  createDownload(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  compareWith(o1: Course | Lesson, o2: Course | Course[] | Lesson | Lesson[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: Course | Lesson) => u.id === o1.id);
    }

    return o1.id === o2.id;
  }
}
