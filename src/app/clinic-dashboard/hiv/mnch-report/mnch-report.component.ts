import { Component, OnInit } from '@angular/core';
import { MnchBaseReportComponent } from 'src/app/hiv-care-lib/mnch-report/mnch-base-report/mnch-base-report.component';
import { MnchResourceService } from 'src/app/etl-api/mnch-resource.service';
import * as Moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'mnch-reports',
  templateUrl:
    '../../../hiv-care-lib/mnch-report/mnch-base-report/mnch-base-report.component.html'
})
export class MnchReportComponent
  extends MnchBaseReportComponent
  implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public mnchReport: MnchResourceService
  ) {
    super(router, route, mnchReport);
  }
  public params: any;
  public prepReportSummaryData: any = [];
  public columnDefs: any = [];

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  ngOnInit() {
    this.params = { _month: Moment().format('YYYY-MM-DD') };
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params && params.month) {
          this.isLoading = true;
          this.params = params;
          this.generateReport();
        }
      },
      (error) => {
        console.error('Error', error);
        this.showInfoMessage = true;
      }
    );
  }
}
