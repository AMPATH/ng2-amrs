import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { AppState } from './app.service';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { DataCacheService } from './shared/services/data-cache.service';
import { PouchdbService } from './pouchdb-service/pouchdb.service';
export const AgGridLicence: any = undefined;
@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public title = 'Ampath POC';
  private routes: any[];
  constructor(
    public appState: AppState,
    public dataCache: DataCacheService,
    private pouchdbservice: PouchdbService
  ) {
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
