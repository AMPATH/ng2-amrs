import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlhivNcdV2ResourceService } from 'src/app/etl-api/plhiv-ncd-v2-resource.service';
import { PlhivNcdV2ReportBaseComponent } from 'src/app/hiv-care-lib/plhiv-ncd-v2-report/plhiv-ncd-v2-report-base/plhiv-ncd-v2-report-base.component';
import * as Moment from 'moment';

@Component({
  selector: 'app-plhiv-ncd-v2-report',
  templateUrl:
    '../../../hiv-care-lib/plhiv-ncd-v2-report/plhiv-ncd-v2-report-base/plhiv-ncd-v2-report-base.component.html'
  // styleUrls: ['./plhiv-ncd-v2-report.component.css']
})
export class PlhivNcdV2ReportComponent
  extends PlhivNcdV2ReportBaseComponent
  implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public plhivNcdV2ResourceService: PlhivNcdV2ResourceService
  ) {
    super(router, route, plhivNcdV2ResourceService);
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
