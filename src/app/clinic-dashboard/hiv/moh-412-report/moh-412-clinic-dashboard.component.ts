import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClinicDashboardCacheService } from './../../services/clinic-dashboard-cache.service';
import { ClinicFlowCacheService } from './../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';

@Component({
  selector: 'moh-412-clinic-dashboard-report',
  templateUrl: './moh-412-clinic-dashboard.component.html',
  styleUrls: ['./moh-412-clinic-dashboard.component.css']
})
export class MOH412ClinicDashboardComponent implements OnInit {
  public dashboardType = 'clinic-dashboard';
  public selectedLocation = '';
  public routeSub: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private clinicFlowCacheService: ClinicFlowCacheService
  ) {}

  public ngOnInit() {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((location) => {
        this.selectedLocation = location;
        this.clinicFlowCacheService.setSelectedLocation(location);
      });

    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.selectedLocation = params['location_uuid'];
      this.clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });
  }
}
