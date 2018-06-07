import { Injectable } from '@angular/core';
import * as WordExtractor from 'word-extractor';
import { ElectronService } from '../providers/electron.service'

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private electron: ElectronService) {
    //this.readDir("src/assets/lessons/braille/");
    this.loadAllDirs()
  }

  /*
  - Predefined chapters
  - Custom folder

  - .doc and .txt supported
  */

  lessons = {
    static: []
  }

  loadAllDirs() {
    let url = 'src/assets/lessons/';
    let dir = this.electron.fs.readdirSync(url);
    for (let folder of dir) {
      console.log(folder)
      if (folder.indexOf(".") == -1)
        this.loadFolder(url, folder);
    }
  }

  loadFolder(path: string, folderName: string) {
    let url = path + folderName + "/";
    let dir = this.electron.fs.readdirSync(url);
    console.log("DIR:", dir);
    this.lessons[folderName] = [];
    console.log("Lessons:", this.lessons)
    for (let file of dir) {
      this.lessons[folderName].push({
        name: file,
        content: this.loadFromFile(url + file)
      })
    }
    console.log("Loaded lessons: ", this.lessons);
  }

  loadFromFile(url: string): string {
    //if fileending .doc
    let split = url.split(".");
    let fileEnding = split[split.length - 1];
    console.log("File ending is: ", fileEnding)

    switch (fileEnding) {
      case "doc": case "docx": return this.getDocFileContents(url);
      case "txt": return this.getTXTFileContents(url);
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
