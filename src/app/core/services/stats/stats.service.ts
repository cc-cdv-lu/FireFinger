import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor() {}

  registerError(bla: any) {
    console.log('Error registered.', bla);
  }
}
