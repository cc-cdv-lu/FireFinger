import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { DEFAULT_STYLE, DEFAULT_USER, Style, User } from '../data.types';

import { UserService } from '../user/user.service';

const { Storage } = Plugins;

type Config = {
  style: Style;
  user: User;
};

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  loadedConfig: Config;

  constructor(userService: UserService) {
    // listen for on user change, to load config

    userService.onUserChange.subscribe((username: string) => {
      this.retrieveConfig(username);
    });
  }

  async retrieveConfig(username: string): Promise<Config> {
    const ret = await Storage.get({ key: `CONFIG_${username}` });
    this.loadedConfig = ret.value
      ? JSON.parse(ret.value)
      : this.getDefaultConfig();

    return this.loadedConfig;
  }

  getConfig(): Config {
    if (!this.loadedConfig) {
      this.loadedConfig = this.getDefaultConfig();
    }
    return this.loadedConfig;
  }

  getStyle(): Style {
    return this.getConfig().style;
  }

  getUser(): User {
    return this.getConfig().user;
  }

  async saveConfig(username?: string): Promise<void> {
    username = username ? username : this.loadedConfig.user.name;
    await Storage.set({
      key: `CONFIG_${username}`,
      value: JSON.stringify(this.loadedConfig),
    });
  }

  getDefaultConfig(): Config {
    const c: Config = {
      style: DEFAULT_STYLE,
      user: DEFAULT_USER,
    };

    return c;
  }
}
