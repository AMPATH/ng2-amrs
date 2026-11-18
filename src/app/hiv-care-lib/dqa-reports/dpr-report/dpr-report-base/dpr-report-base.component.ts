import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as Moment from 'moment';
import { take } from 'rxjs/operators';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';

@Component({
  selector: 'app-dpr-report-base',
  templateUrl: './dpr-report-base.component.html',
  styleUrls: ['./dpr-report-base.component.css']
})
export class DprReportBaseComponent implements OnInit {
  public enabledControls = 'locationControl,datesControl';
  // Default 12-month cohort ART start window: last month (the 24-month cohort
  // is the same window one year earlier, derived on the server).
  public startDate: Date = Moment()
    .subtract(1, 'month')
    .startOf('month')
    .toDate();
  public endDate: Date = Moment().subtract(1, 'month').endOf('month').toDate();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService
  ) {}

  public ngOnInit() {}

  public generateReport() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .pipe(take(1))
      .subscribe((data: any) => {
        const locations = data && data.locations ? data.locations : [];
        this.router.navigate(['dpr-report-patientlist'], {
          relativeTo: this.route,
          queryParams: {
            locationUuids: locations.map((l: any) => l.value).join(','),
            startDate: Moment(this.startDate).format('YYYY-MM-DD'),
            endDate: Moment(this.endDate).format('YYYY-MM-DD')
          }
        });
      });
  }
}
