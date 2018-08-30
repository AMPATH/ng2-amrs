import { Component, OnInit } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
@Component({
  selector: 'app-cdm-summary',
  templateUrl: './cdm-summary.component.html',
  styleUrls: ['./cdm-summary.component.css']
})
export class CdmSummaryComponent implements OnInit {

  constructor(private appFeatureAnalytics: AppFeatureAnalytics) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Cdm Summary Loaded', 'ngOnInit');
  }

}
