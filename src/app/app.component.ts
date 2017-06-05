/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { LicenseManager } from 'ag-grid-enterprise/main';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import { DataCacheService } from './shared/services/data-cache.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class App {

  name = 'Ampath POC';
  routes: any[];
  constructor(public appState: AppState, public dataCache: DataCacheService) {
    this.setUpAgGridLicense();
  }

  ngOnInit() {
    this.dataCache.setDefaulTime(60 * 5);
    this.dataCache.clearExpired();
  }

  setUpAgGridLicense() {
    if (AgGridLicence) {
      // console.error('AG Grid License', AgGridLicence);
      LicenseManager.setLicenseKey(AgGridLicence);
    }
  }
}
