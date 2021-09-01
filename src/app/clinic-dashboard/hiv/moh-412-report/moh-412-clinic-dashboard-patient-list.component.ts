import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'moh-412-clinic-dashboard-patient-list',
  templateUrl: './moh-412-clinic-dashboard-patient-list.component.html'
})
export class MOH412ClinicDashboardPatientListComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit() {}
}
