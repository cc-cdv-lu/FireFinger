import { Injectable } from '@angular/core';
import * as WordExtractor from 'word-extractor';
import { ElectronService } from '../providers/electron.service'


export class Lesson {
  name: string;
  chapters: Array<Chapter>;
}
export class Chapter {
  name: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  appDataURL: string;
  docsURL: string;
  constructor(private electron: ElectronService) {
    if (this.electron.isDev())
      this.loadDebugData();
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
      chapters: []
    }
    for (let file of dir) {
      let fileURL = this.electron.path.join(url, file);
      lesson.chapters.push({
        name: file,
        content: this.loadFromFile(fileURL)
      })
    }
    this.lessons.push(lesson);
  }

  loadFromFile(url: string): string {
    let fileEnding = this.electron.path.extname(url)

    switch (fileEnding) {
      case ".doc": case ".docx": return this.getDocFileContents(url);
      case ".txt": return this.getTXTFileContents(url);
    }
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
    let file = this.electron.fs.readFileSync(url, 'utf8')
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

  loadDebugData() {
    this.lessons.push({
      name: 'debug',
      chapters: [
        {
          name: 'debug01',
          content: 'qwertz'
        },
        {
          name: 'debug02',
          content: 'asdfg'
        },
        {
          name: 'special_char',
          content: '! ? € , . -\n_ ; : ( ) & %'
        }
      ]
    })
  }
}
