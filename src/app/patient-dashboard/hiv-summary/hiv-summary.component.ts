import { Component, OnInit } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
@Component({
  selector: 'app-hiv-summary',
  templateUrl: './hiv-summary.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryComponent implements OnInit {

  constructor(private appFeatureAnalytics: AppFeatureAnalytics) {
  }

  ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Hiv Summary Loaded', 'ngOnInit');
  }

}
