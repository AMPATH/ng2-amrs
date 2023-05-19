import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClinicDashboardCacheService } from './../../services/clinic-dashboard-cache.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clinic-dashboard-covid-19-report',
  templateUrl: './clinic-dashboard-covid-19-report.component.html',
  styleUrls: ['./clinic-dashboard-covid-19-report.component.css']
})
export class ClinicDashboardCovid19ReportComponent implements OnInit {
  public title = 'Covid-19 Vaccination Report';
  public locationUuids: any = [];
  public routeSub: Subscription = new Subscription();
  public dashboardType = 'clinic-dashboard';

  constructor(
    public route: ActivatedRoute,
    private clinicDashboardCacheService: ClinicDashboardCacheService
  ) {}

  public ngOnInit() {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
      });
    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.locationUuids = params['location_uuid'];
      this.clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });
  }
}
