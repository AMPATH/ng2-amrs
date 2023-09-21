import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ncd-report',
  templateUrl: './ncd-report.component.html'
})
export class NcdReportComponent implements OnInit {
  public title = 'NCD Monthly Report';
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
