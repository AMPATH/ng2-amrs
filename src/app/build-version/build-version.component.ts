import { Component, OnInit } from '@angular/core';
import { VERSION } from '../../environments/version';
@Component({
  selector: 'build-version',
  template: `<p class="text-right text-bold">v{{version}} {{hash}} - build {{buildDate | date:'medium' }}`
})
export class BuildVersionComponent implements OnInit {
  public version: string;
  public buildDate: Date;
  public hash: string;
  constructor() {
  }

  public ngOnInit() {
    this.loadVersion();
  }

  public loadVersion() {

    try {
      this.version = VERSION.version;
      this.hash = VERSION.hash;
      this.buildDate = new Date(VERSION.buildDate);

    } catch (e) {
    }
  }
}
