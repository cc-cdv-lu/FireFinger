import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

import { DEFAULT_STYLE, Style } from '../style/style.service';
import { User } from '../user-service/user-service.service';

const { Storage } = Plugins;

type Config = {
  style: Style;
  user: User;
};

@Injectable({
  providedIn: 'root',
})
export class ConfigServiceService {
  loadedConfig: Config;

  constructor() {
    // listen for on user change, to load config
  }

  async retrieveConfig(username: string): Promise<Config> {
    const ret = await Storage.get({ key: `CONFIG_${username}` });
    this.loadedConfig = ret.value
      ? JSON.parse(ret.value)
      : this.getDefaultConfig();

    return this.loadedConfig;
  }

  async saveConfig(username: string): Promise<void> {
    await Storage.set({
      key: `CONFIG_${username}`,
      value: JSON.stringify(this.loadedConfig),
    });
  }

  getDefaultConfig(): Config {
    const c: Config = {
      style: DEFAULT_STYLE,
      user: { stats: {} },
    };

    return c;
  }
}
