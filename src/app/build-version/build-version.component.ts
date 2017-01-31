import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'build-version',
    template: `<p class="text-right text-bold">v{{version}}
     - build {{buildDate | date:'medium'}}</p>`
})
export class BuildVersionComponent implements OnInit {
    version: string;
    buildDate: Date;

    constructor() {}

    ngOnInit() {
        this.loadVersion();
    }

    loadVersion() {

        try {

        let json = require('../version.json');

        if (json && json.version) {

            this.version = json.version.version;
            this.buildDate = new Date(json.version.buildDate);
        }

        } catch (e) { }
    }
}
