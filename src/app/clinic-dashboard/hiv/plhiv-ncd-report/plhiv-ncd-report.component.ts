import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
import { PlhivNcdReportBaseComponent } from 'src/app/hiv-care-lib/plhiv-ncd-report/plhiv-ncd-report-base/plhiv-ncd-report-base.component';
import { PlhivNcdReportService } from 'src/app/etl-api/plhiv-ncd-report.service';
@Component({
  selector: 'app-plhiv-ncd-report',
  templateUrl:
    '../../../hiv-care-lib/plhiv-ncd-report/plhiv-ncd-report-base/plhiv-ncd-report-base.component.html'
})
export class PlhivNcdReportComponent
  extends PlhivNcdReportBaseComponent
  implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public plhivNcdReportService: PlhivNcdReportService
  ) {
    super(router, route, plhivNcdReportService);
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
