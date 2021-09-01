import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'moh-412-oncology-data-analytics-report',
  templateUrl: './moh-412-data-analytics.component.html',
  styleUrls: ['./moh-412-data-analytics.component.css']
})
export class MOH412OncologyDataAnalyticsComponent implements OnInit {
  public dashboardType = 'data-analytics';

  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit() {}
}
