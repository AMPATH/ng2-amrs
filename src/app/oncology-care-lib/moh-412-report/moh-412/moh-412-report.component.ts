import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MOH412ResourceService } from './../../../etl-api/moh-412-resource.service';

@Component({
  selector: 'app-moh-412-report',
  templateUrl: './moh-412-report.component.html',
  styleUrls: ['./moh-412-report.component.css']
})
export class MOH412ReportComponent implements OnInit, AfterViewInit {
  public title = 'Cervical Cancer Screening Monthly Summary';
  public params: any;
  public moh412Data = [];
  public totalsData = [];
  public reportDef = [];
  public currentView = 'pdf';
  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public error = {
    error: false,
    message: ''
  };
  @Input() public dashboardType = '';
  @Input() public dashboardLocation = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public moh412MonthlyService: MOH412ResourceService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          if (params.startDate && params.locationUuids) {
            this.params = params;
            this.generateReport(this.params);
            this.toggleCurrentView(params.currentView);
          }
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  public ngAfterViewInit() {}

  public generateReport(params: any) {
    this.setBusy();
    this.resetErrorObj();
    this.moh412MonthlyService.getMoh412MonthlyReport(params).subscribe(
      (result) => {
        this.moh412Data = result.result;
        this.reportDef = result.sectionDefinitions;
        this.totalsData = result.totalResults;
        this.setFree();
      },
      (error) => {
        this.setFree();
        this.error = {
          error: true,
          message: 'An error occured.Kindly try reloading page ...'
        };
      }
    );
  }

  public onTabChanged($event: any) {
    const tabIndex = $event.index;
    switch (tabIndex) {
      case 0:
        this.currentView = 'pdf';
        break;
      case 1:
        this.currentView = 'tabular';
        break;
      default:
        this.currentView = 'pdf';
    }
  }

  private setBusy() {
    this.busyIndicator = {
      busy: true,
      message: 'Please wait...Loading'
    };
  }
  private setFree() {
    this.busyIndicator = {
      busy: false,
      message: ''
    };
  }
  private resetErrorObj() {
    this.error = {
      error: false,
      message: ''
    };
  }
  public toggleCurrentView(currentView: string = 'pdf') {
    this.currentView = currentView;
  }
}
