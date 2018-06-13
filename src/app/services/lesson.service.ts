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
  //url: string = 'C:/Users/jhoffmann/Documents/Projects/FireFinger/src/assets/lessons/';//'src/assets/lessons/';
  //url: string = 'C:/Program Files/FireFinger/docs/';
  lessons: Array<Lesson> = [
    {
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
    }
  ]

  loadAllDirs() {
    //let dir = this.electron.fs.readdirSync(this.url);
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
    this.electron.fs.mkdirSync(this.docsURL);

    console.log("AppPath:", this.electron.app.getAppPath());

    let assetsURL = "";
    if (this.electron.isDev()) {
      assetsURL = this.electron.path.join(this.electron.app.getAppPath(), 'src/assets/lessons');
    }
    else {
      assetsURL = this.electron.path.join(this.electron.app.getAppPath(), 'assets/lessons');
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
}
