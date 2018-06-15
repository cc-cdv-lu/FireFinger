import { Injectable } from '@angular/core';
import * as WordExtractor from 'word-extractor';
import { ElectronService } from '../providers/electron.service'


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
  amount: number
}
export enum ChapterType {
  CHAR, WORD, DICATION
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  appDataURL: string;
  docsURL: string;
  constructor(private electron: ElectronService) {
    //if (this.electron.isDev())
    //  this.loadDebugData();
    this.appDataURL = this.electron.app.getPath('userData');
    this.docsURL = this.electron.path.join(this.appDataURL, 'docs');
    this.loadAllDirs();
  }

  /*
    - Predefined chapters
    - Custom folder

    - .doc TODO
    .txt supported
  */

  lessons: Array<Lesson> = [];

  loadAllDirs() {
    if (!this.electron.fs.existsSync(this.docsURL)) {
      this.firstLaunch();
    }

    let docsDir = this.electron.fs.readdirSync(this.docsURL);

    if (!docsDir) return console.warn("This url does not exist:", this.docsURL)
    console.log("Loading lessons from folder:", this.docsURL);
    for (let folder of docsDir) {
      if (folder.indexOf(".") == -1)
        this.loadFolder(this.docsURL, folder);
    }
  }

  openDocsFolderInExplorer() {
    this.electron.shell.openExternal(this.docsURL)
  }

  firstLaunch() {
    if (!this.electron.fs.existsSync(this.docsURL)) {
      this.electron.fs.mkdirSync(this.docsURL);
    }

    let assetsURL = "";
    if (this.electron.isDev()) {
      assetsURL = this.electron.path.join(this.electron.app.getAppPath(), 'src/assets/lessons');
    }
    else {
      this.createExampleFolder();
    }

    // If user has not yet had any files in their folder, copy the example files to their folder
    this.electron.fs.copySync(assetsURL, this.docsURL)



    this.openDocsFolderInExplorer();
  }

  loadFolder(path: string, folderName: string) {
    let url = this.electron.path.join(path, folderName);
    let dir = this.electron.fs.readdirSync(url);
    let lesson = {
      name: folderName,
      chapters: new Array<Chapter>(),
      lang: 'de'              //read from meta data
    }
    for (let file of dir) {
      let fileURL = this.electron.path.join(url, file);
      let newChapter: Chapter = this.loadFromFile(fileURL);

      lesson.chapters.push(newChapter)
    }
    this.lessons.push(lesson);
  }

  loadFromFile(url: string): Chapter {
    let fileEnding = this.electron.path.extname(url);
    let filename = this.electron.path.basename(url);

    let regexp = /#{5,}/;
    let fileContent: string = "";

    switch (fileEnding) {
      case ".doc": case ".docx": fileContent = this.getDocFileContents(url); break;
      case ".txt": fileContent = this.getTXTFileContents(url); break;
      default: console.log("Cannot get contents from this file:", url); break;
    }

    /* Parse content */

    let output: Chapter = {
      name: filename, // Try to get it from name field
      type: -1,
      amount: -1,
      characters: "",
      newCharacters: "",
      content: ''
    };

    /* IF IT'S A DICTATION LESSON */
    if (!fileContent.match(regexp)) {
      /* If there is no ###### present, then it's simply a dictation
        take the whole text as content and generate the rest/use default values */
      output.content = fileContent;
      output.characters = this.getCharsOfText(fileContent);
      output.type = ChapterType.DICATION;

      return output;
    }
    else {
      let split = fileContent.split(regexp);

      let jsonString = split[0].trim();
      let data = JSON.parse(jsonString);

      output.content = split[1];
      output.characters = this.getCharsOfText(output.content);
      if (data.type != undefined) output.type = data.type;
      if (data.name != undefined) output.name = data.name;
      if (data.amount != undefined) output.amount = data.amount
      if (data.characters != undefined) output.characters = data.characters;
      if (data.newCharacters != undefined) output.newCharacters = data.newCharacters;

      switch (output.type) {
        case ChapterType.CHAR: this.generateCharLesson(output); break;
        case ChapterType.WORD: this.generateWordLesson(output); break;
        default: {
          console.error("Something smells fucky with the type of this...", output);
          break;
        }
      }

      return output;
    }
  }

  getCharsOfText(text: string): string {
    let data = {};
    for (let c of text) {
      data[c] = 'present'
    }
    let output = "";
    for (let c of Object.keys(data)) {
      output += c;
    }
    return output;
  }

  generateCharLesson(chapter: Chapter) {
    // chapter.characters     -> which characters
    // amount                 -> how many letters total
    // chapter.newCharacters  -> favor new characters

    // Try to fill half of output with new characters
    let output = "";
    if (!chapter.amount || !chapter.characters || !chapter.newCharacters) return;
    for (let i = 0; i < chapter.amount / 2; i++) {
      output += this.getRandom(chapter.newCharacters.split(""));
    }

    // Fill the rest with the old characters
    for (let i = output.length; i < chapter.amount; i++) {
      output += this.getRandom(chapter.characters.split(""))
    }

    // copy by reference: simply edit chapter file - no return needed
    chapter.content = this.shuffleString(output);
  }

  generateWordLesson(chapter: Chapter) {

  }

  getDocFileContents(url: string): string {
    let file = this.electron.fs.readFileSync(url, 'utf8');
    //TODO not implemented
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
    let url = this.electron.path.join(this.docsURL, 'example-folder');
    for (let i = 0; i < 5; i++) {
      let content = "Dies ist Beispieltext Nummer " + i;
      let filename = "beispieltext" + i + ".txt";
      this.writeTextFileToFolder(content, filename, url);
    }
  }

  writeTextFileToFolder(content: string, filename: string, location: string) {
    if (!this.electron.fs.existsSync(location)) {
      this.electron.fs.mkdirSync(location);
    }
    let path = this.electron.path.join(location, filename);
    this.electron.fs.writeFile(path, content, (err) => {
      if (err) throw console.warn("The was an issue writing this file:", err)
      console.log("The file was save successfully: ", path)
    });
  }

  shuffleString(s: string): string {
    var a = s.split(""),
      n = a.length;

    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join("");
  }

  /**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
  shuffle(input_array) {
    let a = input_array.slice();
    if (!a) return console.error("Array is undefined!");
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(); //little hack to allow copy by value
  }

  getRandom(array) {
    if (array.length <= 0 || !array) {
      console.error("This is not a good array...")
      return null;
    }
    let index = Math.floor(Math.random() * array.length);
    return array[index];
  }
}
