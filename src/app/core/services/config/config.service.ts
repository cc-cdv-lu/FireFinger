import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

export class CONFIG {
  key: string;
}

export class FileCONFIG extends CONFIG {
  customDocsURLS: Array<string> = [];
  constructor() {
    super();
    this.key = 'FILE_CONFIG';
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private electron: ElectronService) {}

  saveCallbacks = [];

  loadConfig<T extends CONFIG>(fallback: T): T {
    const config_data = this.electron.config.get(fallback.key);
    if (config_data && config_data.length) {
      return JSON.parse(config_data) as T;
    }
    return fallback;
  }

  saveConfig<T extends CONFIG>(config: T) {
    this.electron.config.set(config.key, JSON.stringify(config));
  }

  registerSaveCallback(cb: any) {
    if (cb !== undefined && typeof cb === 'function') {
      this.saveCallbacks.push(cb);
    } else {
      console.warn('Could not register cb:', cb);
    }
  }

  saveAll() {
    for (const cb of this.saveCallbacks) {
      console.log('Calling\n', cb);
      cb();
    }
  }
}
