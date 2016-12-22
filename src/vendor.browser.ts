// For vendors for example jQuery, Lodash, angular2-jwt just import them here unless you plan on
// chunking vendors files for async loading. You would need to import the async loaded vendors
// at the entry point of the async loaded file. Also see custom-typings.d.ts as you also need to
// run `typings install x` where `x` is your module

// TODO(gdi2290): switch to DLLs

// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/forms';
import '@angular/http';
import '@angular/router';
// AngularClass
import '@angularclass/hmr';

// RxJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import 'jquery';
import 'bootstrap-loader';
import 'datatables.net';
import 'datatables.net-scroller';
import 'datatables.net-autofill';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs';
import 'datatables.net-colreorder';
import 'datatables.net-fixedcolumns';
import 'datatables.net-keytable';
import 'datatables.net-select';
import 'datatables.net-fixedheader';
import './assets/slimScroll/jquery.slimscroll.min.js';
import './assets/app';
import 'slick-carousel';
if ('production' === ENV) {
  // Production


} else {
  // Development

}
