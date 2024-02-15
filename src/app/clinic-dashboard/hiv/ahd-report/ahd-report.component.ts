import { Component, OnInit } from '@angular/core';
import { AhdReportBaseComponent } from 'src/app/hiv-care-lib/ahd-monthly-report/ahd-report-base/ahd-report-base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AhdResourceService } from 'src/app/etl-api/ahd-resource.service';
import * as Moment from 'moment';
@Component({
  selector: 'ahd-reports',
  templateUrl:
    '../../../hiv-care-lib/ahd-monthly-report/ahd-report-base/ahd-report-base.component.html'
})
export class AhdReportComponent
  extends AhdReportBaseComponent
  implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public ahdReport: AhdResourceService
  ) {
    super(router, route, ahdReport);
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
