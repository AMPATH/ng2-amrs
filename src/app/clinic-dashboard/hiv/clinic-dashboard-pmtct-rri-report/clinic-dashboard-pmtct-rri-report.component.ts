import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';

@Component({
  selector: 'clinic-dashboard-pmtct-rri-report',
  templateUrl: './clinic-dashboard-pmtct-rri-report.component.html',
  styleUrls: ['./clinic-dashboard-pmtct-rri-report.component.css']
})
export class ClinicDashboardPmtctRriReportComponent implements OnInit {
  public selectedClinic = '';
  private subs: Subscription[] = [];
  public routeSub: Subscription;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _clinicDashboardCacheService: ClinicDashboardCacheService
  ) {}

  public ngOnInit() {
    this.routeSub = this._route.parent.parent.params.subscribe((params) => {
      this._clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });

    const sub = this._clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
      });

    this.subs.push(sub);
  }
}
