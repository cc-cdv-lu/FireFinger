import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { StringHelperService } from '../string-helper/string-helper.service';

import { Chapter, Lesson, ChapterType } from '../../types';

import { ConfigService, FileCONFIG } from '../config/config.service';

import * as FS from 'fs-extra';
import * as path from 'path';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  _config: FileCONFIG;
  constructor(
    private electron: ElectronService,
    private stringhelper: StringHelperService,
    private config: ConfigService
  ) {
    this._config = this.config.loadConfig<FileCONFIG>(
      this.generateFallbackConfig()
    );
    this.config.registerSaveCallback(this.saveConfig);
    console.log('File config was loaded:', this._config);
  }

  generateFallbackConfig(): FileCONFIG {
    const output = new FileCONFIG();

    // Set default docs path
    const appDataURL: string = this.electron.app.getPath('userData'); // ..../Username/Documents
    const firefingerDocsURL: string = path.join(appDataURL, 'docs'); // ..../Username/Documents/FireFinger/docs
    output.customDocsURLS.push(firefingerDocsURL);

    return output;
  }

  saveConfig() {
    console.log('Saving config:', this._config);
    this.config.saveConfig<FileCONFIG>(this._config);
  }

  addDocsURL(url: string) {
    if (url && url.length > 10) {
      console.log('Adding new folder...\n', url);
      this._config.customDocsURLS.push(url);
    } else {
      console.warn('Could not add invalid url:', url);
    }
    this.saveConfig();
  }

  removeDocsURL(index: number) {
    if (index <= this._config.customDocsURLS.length && index >= 0) {
      this._config.customDocsURLS.splice(index);
    } else {
      console.warn('Could not remove url at invalid index:', index);
    }
    this.saveConfig();
  }

  getDocsURLs(): string[] {
    if (!this.electron.app || !this._config) {
      console.log('Electron is not loaded...cannot get docs url.');
      return [];
    }
    return this._config.customDocsURLS;
  }

  getBuildInCoursesURL() {
    let assetsURL = '';
    if (this.electron.isDev()) {
      assetsURL = path.join(
        this.electron.app.getAppPath(),
        'src/assets/buildIn'
      );
    } else {
      assetsURL = path.join(
        this.electron.app.getAppPath(),
        'dist/assets/buildIn'
      );
    }

    return assetsURL;
  }

  loadDir(dirURL: string): Array<Lesson> {
    const output = [];

    if (!FS) {
      console.log('Something went wrong with the file service...');
      return [];
    }

    if (!dirURL || dirURL.length < 5) {
      console.warn('Invalid parameter for fs');
      return [];
    }

    const docsDir = FS.readdirSync(dirURL);

    if (!docsDir) {
      console.warn('This url does not exist:', dirURL);
      return null;
    }
    console.log('Loading lessons from folder:', dirURL);
    for (const folder of docsDir) {
      if (folder.indexOf('.') === -1) {
        this.loadFolder(output, dirURL, folder);
      }
    }
    console.log('Loaded the following data:', output);
    return output;
  }

  loadBuildInLessons(): Array<Lesson> {
    return [...this.loadDir(this.getBuildInCoursesURL())];
  }

  loadCustomLessons(): Array<Lesson> {
    const output: Array<Lesson> = [];
    for (const lessonURL of this.getDocsURLs()) {
      output.push(...this.loadDir(lessonURL));
    }
    return output;
  }

  openFolderInExplorer(url: string) {
    this.electron.shell.openItem(url);
  }

  openDefaultDocsFolderInExplorer() {
    this.openFolderInExplorer(this.getDocsURLs()[0]);
  }

  loadFolder(destination: Lesson[], dirPath: string, folderName: string) {
    const url = path.join(dirPath, folderName);
    const dir = FS.readdirSync(url);
    const lesson = {
      name: folderName,
      chapters: new Array<Chapter>(),
      lang: 'de', // read from meta data
    };
    for (const file of dir) {
      if (file[0] === '.') {
        continue;
      }
      const fileURL = path.join(url, file);
      const newChapter: Chapter = this.loadFromFile(fileURL);
      if (newChapter !== undefined) {
        lesson.chapters.push(newChapter);
      }
    }
    destination.push(lesson);
    return destination;
  }

  loadFromFile(url: string): Chapter {
    const fileEnding = path.extname(url);
    const filename = path.basename(url).replace(fileEnding, '');

    const regexp = /#{5,}/;
    let fileContent = '';

    const output: Chapter = {
      name: filename, // Try to get it from name field
      type: -1,
      amount: -1,
      characters: '',
      newCharacters: '',
      content: '',
      data: {},
    };

    switch (fileEnding.toLowerCase()) {
      case '.doc':
      case '.docx':
        fileContent = this.getDocFileContents(url);
        break;
      case '.txt':
        fileContent = this.getTXTFileContents(url);
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.bmp':
        output.type = ChapterType.SIMPLE;
        output.content = filename.toLowerCase();

        const bitmap = FS.readFileSync(url);
        const data = 'data:image/' + fileEnding.replace('.', '') + ';base64,';
        output.data.imageSRC = data + bitmap.toString('base64');

        output.amount = filename.length;
        const soundURL =
          url.replace(path.basename(url), '') + filename + '.mp3';
        if (FS.pathExistsSync(soundURL)) {
          const soundFile = FS.readFileSync(soundURL);
          const soundData =
            'data:audio/mpeg;base64,' + soundFile.toString('base64');
          output.data.soundSRC = soundData;
        }
        return output;
        break;
      case '.mp3':
      case '.wav':
        return undefined;
      default:
        console.log('Cannot get contents from this file:', url);
        break;
    }

    /*
     *
     *     Parse content
     *
     */

    /* IF IT'S A DICTATION LESSON */
    if (!fileContent.match(regexp)) {
      /* If there is no ###### present, then it's simply a dictation
        take the whole text as content and generate the rest/use default values */
      output.content = fileContent;
      output.characters = this.getCharsOfText(fileContent);
      output.type = ChapterType.DICTATION;

      return output;
    } else {
      const split = fileContent.split(regexp);

      const jsonString = split[0].trim();
      const data = JSON.parse(jsonString);

      output.content = split[1];
      output.characters = this.getCharsOfText(output.content);

      output.type = data.type ? data.type : ChapterType.CHAR;
      output.name = data.name ? data.name : '';
      output.amount = data.amount ? data.amount : -1;
      output.characters = data.characters ? data.characters : '';
      output.newCharacters = data.newCharacters ? data.newCharacters : '';

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

  generateSimpleLesson(url: string) {}

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

  generateWordLesson(chapter: Chapter) {
    console.warn('Word lessons are currently not supported!');
  }

  getDocFileContents(url: string): string {
    const file = FS.readFileSync(url, 'utf8');
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
    let file = FS.readFileSync(url, 'utf8');

    file = file.replace(/(?:\r\n|\r|\n)/g, '\n');

    return file;
  }

  writeTextFileToFolder(content: string, filename: string, location: string) {
    if (!FS.existsSync(location)) {
      FS.mkdirSync(location);
    }
    const filePath = path.join(location, filename);
    FS.writeFile(filePath, content, err => {
      if (err) {
        throw console.warn('The was an issue writing this file:', err);
      }
      console.log('The file was save successfully: ', filePath);
    });
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffle(input_array: Array<any>) {
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

  getRandom(array: Array<any>) {
    if (array.length <= 0 || !array) {
      console.error('This is not a good array...');
      return null;
    }
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }
}
