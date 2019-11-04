import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurgeReportBaseComponent } from 'src/app/hiv-care-lib/surge-report/surge-report-base.component';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';

@Component({
  selector: 'surge-report',
  templateUrl: '../../../hiv-care-lib/surge-report/surge-report-base.component.html'
})
export class SurgeReportComponent extends SurgeReportBaseComponent implements OnInit {

  public params: any;
  public surgeReportSummaryData: any = [];
  public columnDefs: any = [];

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;

  constructor(public router: Router,
    public route: ActivatedRoute,
    public surgeReport: SurgeResourceService) {
    super(router, route, surgeReport);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        switch (params.currentView) {
          case 'daily':
            if (params && params._date) {
                this.isLoading = true;
                this.params = params;
                this.getSurgeDailyReport(params);
            }
            break;
          case 'weekly':
            if (params && params.year_week) {
                this.isLoading = true;
                this.params = params;
                this.getSurgeWeeklyReport(params);
            }
            break;
        }
      },
      error => {
        console.error('Error', error);
        this.showInfoMessage = true;
      }
    );
  }

}
