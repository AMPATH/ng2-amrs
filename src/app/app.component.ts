import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppState } from './app.service';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { DataCacheService } from './shared/services/data-cache.service';
declare const AgGridLicence: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Ampath POC';
  routes: any[];
  constructor(public appState: AppState, public dataCache: DataCacheService) {
    this.setUpAgGridLicense();
  }

  public ngOnInit() {
    this.dataCache.setDefaulTime(60 * 5);
    this.dataCache.clearExpired();
  }

  public setUpAgGridLicense() {
    if (AgGridLicence) {
      // console.error('AG Grid License', AgGridLicence);
      LicenseManager.setLicenseKey(AgGridLicence);
    }
  }
}
