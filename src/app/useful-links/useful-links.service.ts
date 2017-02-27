import { Injectable } from '@angular/core';

@Injectable()
export class UsefulLinksService {
  constructor() {}

  getNativeWindow() {
    return window;
  }
}
