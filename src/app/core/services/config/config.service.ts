import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import {
  Config,
  DEFAULT_CONFIG,
  DEFAULT_STYLE,
  DEFAULT_TTS,
  DEFAULT_USER,
  Style,
  TTSConfig,
  User,
} from '../../data.types';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  loadedConfig: Config;

  constructor(private userService: UserService) {}

  prepare() {
    this.userService.onUserChange.subscribe((username) => {
      this.retrieveConfig(username);
    });
  }

  async retrieveConfig(username: string): Promise<Config> {
    const ret = await Storage.get({ key: `CONFIG_${username}` });
    this.loadedConfig = ret.value
      ? JSON.parse(ret.value)
      : this.getDefaultConfig();

    this.loadedConfig.user.name = username;
    console.log('Retrieved config:', this.loadedConfig);
    return this.loadedConfig;
  }

  getConfig(): Config {
    if (!this.loadedConfig) {
      this.loadedConfig = this.getDefaultConfig();
    }
    return this.loadedConfig;
  }

  getTTS(): TTSConfig {
    return this.getConfig().tts ?? DEFAULT_TTS;
  }

  getStyle(): Style {
    return this.getConfig().style ?? DEFAULT_STYLE;
  }

  getUser(): User {
    return this.getConfig().user ?? DEFAULT_USER;
  }

  async saveConfig(username?: string): Promise<void> {
    username = username ? username : this.loadedConfig.user.name;
    await Storage.set({
      key: `CONFIG_${username}`,
      value: JSON.stringify(this.loadedConfig),
    });

    console.log('Saved config for user', username, this.loadedConfig);
  }

  getDefaultConfig(): Config {
    console.log('DEFAULT CONFIG', DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}
