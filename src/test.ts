// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require
.context('./', true, /app\/hiv-care-lib\/clinic-flow\/clinic-flow\.component\.spec\.ts$/);
// const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);


// clinic-flow-provider-stats 1
// clinic-flow-summary 3
// clinic-flow.component
