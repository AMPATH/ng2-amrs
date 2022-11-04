import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { IptBaseReportComponent } from 'src/app/hiv-care-lib/ipt-report/ipt-report-base.component';
import { IptReportService } from 'src/app/etl-api/ipt-report.service';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'ipt-report',
  templateUrl: '../../../hiv-care-lib/ipt-report/ipt-report-base.component.html'
})
export class IptReportComponent
  extends IptBaseReportComponent
  implements OnInit
{
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public iptReportService: IptReportService,
    public _location: Location
  ) {
    super(route, router, iptReportService, _location);
  }
  public ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (!_.isEmpty(params)) {
        this.isLoading = true;
        this.params = params;
        this.month = params.endDate;
        this.getIptReportSummaryData();
      }
    });
  }
}
