import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'build-version',
  template: `<p class="text-right text-bold">v{{version}}
    - build {{buildDate | date:'medium'}}</p>`
})
export class BuildVersionComponent implements OnInit {
  public version: string;
  public buildDate: Date;

  constructor() {
  }

  public ngOnInit() {
    this.loadVersion();
  }

  public loadVersion() {

    try {

      let json = require('../version.json');

      if (json && json.version) {

        this.version = json.version.version;
        this.buildDate = new Date(json.version.buildDate);
      }

    } catch (e) {
    }
  }
}
