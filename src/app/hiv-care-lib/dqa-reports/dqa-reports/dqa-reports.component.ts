import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ClinicDashboardCacheService } from 'src/app/clinic-dashboard/services/clinic-dashboard-cache.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dqa-reports',
  templateUrl: './dqa-reports.component.html',
  styleUrls: ['./dqa-reports.component.css']
})
export class DqaReportsComponent implements OnInit {
  public title = 'DQA Report';
  public navigationEnd: any;
  public routePathParam: any;
  public dqaReportTypes: any = require('./dqa-reports.json');
  constructor(private router: Router,
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  public navigateToReport(reportName: any) {
      this.router.navigate(['dqa-report'], {
        relativeTo: this.route,
        queryParams: {
          report: reportName.url,
        }
      });
  }
}
