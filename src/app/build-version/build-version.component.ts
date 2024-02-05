import { Component, OnInit } from '@angular/core';
import { VERSION } from '../../environments/version';
@Component({
  selector: 'build-version',
  template: `<p class="text-right text-bold">
    v{{ version }} {{ hash }} - build {{ buildDate | date: 'medium' }}
  </p>`
})
export class BuildVersionComponent implements OnInit {
  public version: string;
  public buildDate: any;
  public hash: string;
  constructor() {}

  public ngOnInit() {
    this.loadVersion();
  }

  public loadVersion() {
    try {
      this.version = VERSION.version;
      this.hash = VERSION.hash;
      this.buildDate = 'Jan 15, 2024, 6:51:04 PM'; // new Date(VERSION.buildDate);
    } catch (e) {}
  }
}
