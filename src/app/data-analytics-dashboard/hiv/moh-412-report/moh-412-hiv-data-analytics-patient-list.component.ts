import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'moh-412-hiv-data-analytics-patient-list',
  templateUrl: './moh-412-hiv-data-analytics-patient-list.component.html'
})
export class MOH412HIVDataAnalyticsPatientListComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit() {}
}
