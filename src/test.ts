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
.context('./', true, /app\/clinic-dashboard\/oncology\/clinic-flow\/daily-schedule-clinic-flow\.component\.spec.ts$/);
// const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// F:\POC\ng2-amrs\src\app\clinic-dashboard\dashboard-filters\dashboard-filters.component.spec.ts
// F:\POC\ng2-amrs\src\app\clinic-dashboard\cdm\clinic-flow\daily-schedule-clinic-flow.component.spec.ts
// F:\POC\ng2-amrs\src\app\clinic-dashboard\oncology\clinic-flow\daily-schedule-clinic-flow.component.spec.ts