import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { AppState } from './app.service';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { DataCacheService } from './shared/services/data-cache.service';
import { PouchdbService } from './pouchdb-service/pouchdb.service';
export const AgGridLicence: any = undefined;

const bodyClasses = [
  "hold-transition",
  "skin-black-light",
  "fixed-sidebar-min",
  "sidebar-mini",
  "sidebar-collapse",
  "fixed"
]

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Ampath POC';
  private routes: any[];
  constructor(public appState: AppState,
    public dataCache: DataCacheService,
    private pouchdbservice: PouchdbService) {
    this.setUpAgGridLicense();
  }

  public ngOnInit() {
    this.dataCache.setDefaulTime(60 * 5);
    this.dataCache.clearExpired();
    bodyClasses.forEach(className => {
      document.body.classList.add(className)
    })
  }

  public ngOnDestroy() {
    bodyClasses.forEach(className => {
      document.body.classList.remove(className)
    })
  }

  public setUpAgGridLicense() {
    if (AgGridLicence) {
      // console.error('AG Grid License', AgGridLicence);
      LicenseManager.setLicenseKey(AgGridLicence);
    }
  }
}
