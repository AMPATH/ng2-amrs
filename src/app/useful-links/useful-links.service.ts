import { Injectable } from "@angular/core";

@Injectable()
export class UsefulLinksService {
  constructor() {}

  public getNativeWindow() {
    return window;
  }
}
