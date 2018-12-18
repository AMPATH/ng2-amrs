
import {take} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { OncologyReportService } from '../../../etl-api/oncology-reports.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'oncology-reports',
  templateUrl: './oncology-reports.component.html',
  styleUrls: ['./oncology-reports.component.css']
})
export class OncologyReportsComponent implements OnInit {

  public tittle: string  = 'Oncology Reports';
  public oncologyReports: any;
  public specificOncologyReport: any;
  public startDate: string = Moment().startOf('year').format('YYYY-MM-DD');
  public endDate: string = Moment().endOf('month').format('YYYY-MM-DD');

  constructor(
    private _oncologyReportService: OncologyReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  public ngOnInit() {
     this.getOncologyReports();
  }

  public getOncologyReports() {
     this._oncologyReportService.getOncologyReports().pipe(
        take(1)).subscribe((result) => {
           this.oncologyReports = result;
        });
  }

  public navigateToReport(report: any, oncologyReport: any, reportIndex: number) {
    let queryParams = this.route.snapshot.params;
    let reportParams = report.reportDefaults;
    let params = {

      type: report.type,
      report: report.name

    };
    this.router.navigate(['./' + report.type + '']
      , {
           relativeTo: this.route,
           queryParams: params
     });
  }
}
