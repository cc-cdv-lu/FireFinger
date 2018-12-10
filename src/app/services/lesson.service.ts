import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { StringHelperService } from './string-helper.service';

export class Lesson {
  name: string;
  chapters: Array<Chapter>;
  lang: string;
}
export class Chapter {
  name: string;
  content: string;
  type: ChapterType;
  characters: string;
  newCharacters: string;
  amount: number;
}
export enum ChapterType {
  CHAR,
  WORD,
  DICATION,
}

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  appDataURL: string; // ..../Username/Documents
  firefingerURL: string; // ..../Username/Documents/FireFinger
  lessons: Array<Lesson> = [];
  constructor(
    private electron: ElectronService,
    private stringhelper: StringHelperService
  ) {
    // this.documentsURL = this.electron.app.getPath('documents');
    this.appDataURL = this.electron.app.getPath('userData');
    this.firefingerURL = this.electron.path.join(this.appDataURL, 'docs');
    this.loadAllDirs();

    /*
    try {
      // TODO find a way to import this in production
      this.docsURL = 'src/assets/lessons/';
      this.loadAllDirs();
    } catch (err) { console.log('Did not work...', err); }
    */
  }

  loadAllDirs(): Array<Lesson> {
    if (!this.electron.fs.existsSync(this.firefingerURL)) {
      this.firstLaunch();
    }

    const docsDir = this.electron.fs.readdirSync(this.firefingerURL);

    if (!docsDir) {
      console.warn('This url does not exist:', this.firefingerURL);
      return null;
    }
    console.log('Loading lessons from folder:', this.firefingerURL);
    for (const folder of docsDir) {
      if (folder.indexOf('.') === -1) {
        this.loadFolder(this.firefingerURL, folder);
      }
    }
    return this.lessons;
  }

  reload(): Array<Lesson> {
    this.lessons = [];
    return this.loadAllDirs();
  }

  openDocsFolderInExplorer() {
    this.electron.shell.openExternal(this.appDataURL + '/docs');
  }

  firstLaunch() {
    if (!this.electron.fs.existsSync(this.firefingerURL)) {
      this.electron.fs.mkdirSync(this.firefingerURL);
    }

    let assetsURL = '';
    if (this.electron.isDev()) {
      assetsURL = this.electron.path.join(
        this.electron.app.getAppPath(),
        'src/assets/lessons'
      );
    } else {
      this.createExampleFolder();
    }

    // If user has not yet had any files in their folder, copy the example files to their folder
    this.electron.fs.copySync(assetsURL, this.firefingerURL);

    this.openDocsFolderInExplorer();
  }

  loadFolder(path: string, folderName: string) {
    const url = this.electron.path.join(path, folderName);
    const dir = this.electron.fs.readdirSync(url);
    const lesson = {
      name: folderName,
      chapters: new Array<Chapter>(),
      lang: 'de', // read from meta data
    };
    for (const file of dir) {
      if (file[0] === '.') {
        continue;
      }
      const fileURL = this.electron.path.join(url, file);
      const newChapter: Chapter = this.loadFromFile(fileURL);

      lesson.chapters.push(newChapter);
    }
    this.lessons.push(lesson);
  }

  loadFromFile(url: string): Chapter {
    const fileEnding = this.electron.path.extname(url);
    const filename = this.electron.path.basename(url);

    const regexp = /#{5,}/;
    let fileContent = '';

    switch (fileEnding) {
      case '.doc':
      case '.docx':
        fileContent = this.getDocFileContents(url);
        break;
      case '.txt':
        fileContent = this.getTXTFileContents(url);
        break;
      default:
        console.log('Cannot get contents from this file:', url);
        break;
    }

    /*
     *
     *     Parse content
     *
     */

    const output: Chapter = {
      name: filename, // Try to get it from name field
      type: -1,
      amount: -1,
      characters: '',
      newCharacters: '',
      content: '',
    };

    /* IF IT'S A DICTATION LESSON */
    if (!fileContent.match(regexp)) {
      /* If there is no ###### present, then it's simply a dictation
        take the whole text as content and generate the rest/use default values */
      output.content = fileContent;
      output.characters = this.getCharsOfText(fileContent);
      output.type = ChapterType.DICATION;

      return output;
    } else {
      const split = fileContent.split(regexp);

      const jsonString = split[0].trim();
      const data = JSON.parse(jsonString);

      output.content = split[1];
      output.characters = this.getCharsOfText(output.content);
      if (data.type !== undefined) {
        output.type = data.type;
      }
      if (data.name !== undefined) {
        output.name = data.name;
      }
      if (data.amount !== undefined) {
        output.amount = data.amount;
      }
      if (data.characters !== undefined) {
        output.characters = data.characters;
      }
      if (data.newCharacters !== undefined) {
        output.newCharacters = data.newCharacters;
      }

      switch (output.type) {
        case ChapterType.CHAR:
          this.generateCharLesson(output);
          break;
        case ChapterType.WORD:
          this.generateWordLesson(output);
          break;
        default: {
          console.error(
            'Something smells fucky with the type of this...',
            output
          );
          break;
        }
      }

      return output;
    }
  }

  getCharsOfText(text: string): string {
    const data = {};
    for (const c of text) {
      data[c] = 'present';
    }
    let output = '';
    for (const c of Object.keys(data)) {
      output += c;
    }
    return output;
  }

  generateCharLesson(chapter: Chapter) {
    // chapter.characters     -> which characters
    // amount                 -> how many letters total
    // chapter.newCharacters  -> favor new characters

    // Try to fill half of output with new characters
    let output = '';
    if (!chapter.amount || !chapter.characters || !chapter.newCharacters) {
      return;
    }
    for (let i = 0; i < chapter.amount / 2; i++) {
      output += this.getRandom(chapter.newCharacters.split(''));
    }

    // Fill the rest with the old characters
    for (let i = output.length; i < chapter.amount; i++) {
      output += this.getRandom(chapter.characters.split(''));
    }

    // copy by reference: simply edit chapter file - no return needed
    chapter.content = this.stringhelper.shuffleString(output);
  }

  generateWordLesson(chapter: Chapter) {}

  getDocFileContents(url: string): string {
    const file = this.electron.fs.readFileSync(url, 'utf8');
    // TODO not implemented
    /*
    var extractor = new WordExtractor();
    var extracted = extractor.extract(url);
    extracted.then(function(doc) {
      console.log(doc.getBody());
    });*/

    return file;
  }

  getTXTFileContents(url: string): string {
    let file = this.electron.fs.readFileSync(url, 'utf8');

    file = file.replace(/(?:\r\n|\r|\n)/g, '\n');

    return file;
  }

  createExampleFolder() {
    const url = this.electron.path.join(this.firefingerURL, 'example-folder');
    for (let i = 0; i < 5; i++) {
      const content = 'Dies ist Beispieltext Nummer ' + i;
      const filename = 'beispieltext' + i + '.txt';
      this.writeTextFileToFolder(content, filename, url);
    }
  }

  writeTextFileToFolder(content: string, filename: string, location: string) {
    if (!this.electron.fs.existsSync(location)) {
      this.electron.fs.mkdirSync(location);
    }
    const path = this.electron.path.join(location, filename);
    this.electron.fs.writeFile(path, content, err => {
      if (err) {
        throw console.warn('The was an issue writing this file:', err);
      }
      console.log('The file was save successfully: ', path);
    });
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffle(input_array) {
    const a = input_array.slice();
    if (!a) {
      return console.error('Array is undefined!');
    }
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(); // little hack to allow copy by value
  }

  getRandom(array) {
    if (array.length <= 0 || !array) {
      console.error('This is not a good array...');
      return null;
    }
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }
}
