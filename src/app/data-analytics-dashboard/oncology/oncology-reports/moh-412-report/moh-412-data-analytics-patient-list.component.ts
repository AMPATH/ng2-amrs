import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'moh-412-oncology-data-analytics-patient-list',
  templateUrl: './moh-412-data-analytics-patient-list.component.html'
})
export class MOH412OncologyDataAnalyticsPatientListComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit() {}
}
