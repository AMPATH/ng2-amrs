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
.context('./', true, /app\/app\.spec.ts$/);
// const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
//F:\POC\ng2-amrs\src\app\app.spec.ts
//F:\POC\ng2-amrs\src\app\app.component.spec.ts
//F:\POC\ng2-amrs\src\app\shared\services\data-cache.service.spec.ts
//F:\POC\ng2-amrs\src\app\navigation\side-navigation\patient-side-nav\patient-side-nav-routes.factory.spec.ts
//F:\POC\ng2-amrs\src\app\program-manager\program-referral-report-base\patient-referral-report-base.component.spec.ts
//F:\POC\ng2-amrs\src\app\patient-list-cohort\add-cohort-list.component.spec.ts
//F:\POC\ng2-amrs\src\app\shared\app-analytics\app-feature-analytics.service.spec.ts
//F:\POC\ng2-amrs\src\app\shared\data-lists\generic-list\generic-list.component.spec.ts
//F:\POC\ng2-amrs\src\app\shared\dynamic-route\dynamic-routes.service.spec.ts
//F:\POC\ng2-amrs\src\app\shared\locations\location-filter\location-filter.component.spec.ts
//F:\POC\ng2-amrs\src\app\shared\pipes\group-by-priority.pipe.spec.ts
