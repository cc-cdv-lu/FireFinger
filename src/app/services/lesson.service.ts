import { Injectable } from '@angular/core';
import * as WordExtractor from 'word-extractor';
import { ElectronService } from '../providers/electron.service'

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(private electron: ElectronService) {

    this.loadAllDirs()
  }

  /*
  - Predefined chapters
  - Custom folder

  - .doc and .txt supported
  */
  //TODO try to find a way to make this not hard coded
  url: string = 'C:/Users/jhoffmann/Documents/Projects/FireFinger/src/assets/lessons/';//'src/assets/lessons/';
  lessons = [
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
        }
      ]
    }
  ]

  loadAllDirs() {
    let dir = this.electron.fs.readdirSync(this.url);
    if (!dir) return console.warn("This url does not exist:", this.url)
    for (let folder of dir) {
      if (folder.indexOf(".") == -1)
        this.loadFolder(this.url, folder);
    }
  }

  loadFolder(path: string, folderName: string) {
    let url = path + folderName + "/";
    let dir = this.electron.fs.readdirSync(url);
    let lesson = {
      name: folderName,
      chapters: []
    }
    for (let file of dir) {
      lesson.chapters.push({
        name: file,
        content: this.loadFromFile(url + file)
      })
    }
    this.lessons.push(lesson);
  }

  loadFromFile(url: string): string {
    let split = url.split(".");
    let fileEnding = split[split.length - 1];

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
