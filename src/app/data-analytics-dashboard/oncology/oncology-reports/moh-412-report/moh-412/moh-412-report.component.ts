import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MOH412ResourceService } from './../../../../../etl-api/moh-412-resource.service';

@Component({
  selector: 'app-moh-412-report',
  templateUrl: './moh-412-report.component.html',
  styleUrls: ['./moh-412-report.component.css']
})
export class MOH412ReportComponent implements OnInit, AfterViewInit {
  public title = 'Cancer Screening Monthly Summary';
  public params: any;
  public moh412Data = [];
  public reportDef = [];
  public currentView = 'tabular';
  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public error = {
    error: false,
    message: ''
  };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public moh412MonthlyService: MOH412ResourceService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          if (params.startDate) {
            this.params = params;
            this.generateReport(this.params);
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

  public onTabChanged($event) {}

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
}
