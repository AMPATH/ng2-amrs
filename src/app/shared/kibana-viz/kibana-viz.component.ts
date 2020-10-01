import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as rison from 'rison-node';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kibana-viz',
  templateUrl: 'kibana-viz.component.html',
  styleUrls: ['kibana-viz.component.css']
})
export class KibanaVizComponent implements OnInit, OnDestroy {
  public kibanaVizUrl: string;
  public height = '600';
  public width = '99%';
  public lastVizUrl: string;
  constructor(
    protected route: ActivatedRoute,
    protected location: Location,
    protected router: Router
  ) {}

  public ngOnInit() {
    this.loadVizUrlFromUrl();
  }

  public ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  public loadVizUrlFromUrl() {
    const path = this.router.parseUrl(this.location.path());

    if (path.queryParams['vizUrl']) {
      this.kibanaVizUrl = path.queryParams['vizUrl'];
    }
  }

  public onVizUrlChanged(newUrl: string) {
    // store the new url on the route
    // console.log('viz url', newUrl);
    this.lastVizUrl = newUrl;
    const path = this.router.parseUrl(this.location.path());
    path.queryParams['vizUrl'] = this.lastVizUrl;
    this.location.replaceState(path.toString());
  }

  public onPatientNavigationRequested(patientUuid: string) {
    // console.log('load the specified patient here', patientUuid);
    if (patientUuid.length > 4) {
      this.router.navigate([
        '/patient-dashboard/patient/' +
          patientUuid +
          '/general/general/landing-page'
      ]);
    }
  }
}
