import { Component, OnInit } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
@Component({
  selector: 'app-lab-data-summary',
  templateUrl: './lab-data-summary.component.html',
  styleUrls: ['./lab-data-summary.component.css']
})
export class LabDataSummaryComponent implements OnInit {
  constructor(private appFeatureAnalytics: AppFeatureAnalytics) {}

  public ngOnInit() {
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Lab Data Summary Loaded',
      'ngOnInit'
    );
  }
}
