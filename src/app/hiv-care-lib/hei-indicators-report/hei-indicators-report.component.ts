import { take } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HeiReportService } from './../../etl-api/hei-report.service';

@Component({
  selector: 'hei-indicators-report',
  templateUrl: './hei-indicators-report.component.html',
  styleUrls: ['./hei-indicators-report.component.css']
})
export class HeiIndicatorsReportComponent
  implements OnInit {

  @Input() locations = '';
  public params = {
    'startDate': '',
    'endDate': '',
    'locationUuids': '',
    'displayTabluarFilters': true
  };

  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public errorObj = {
    'message': '',
    'isError': false
  };
  public heiSummary: any = [];
  public heiOutcomeSummary: any;
  public sectionDefs: any;
  public outcomeSectionDefs: any;
  public currentView = 'pdf';
  public summaryTitle = 'HEI indicators';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _heiReportService: HeiReportService
  ) { }

  public ngOnInit() {
  }

  public selectedFilter($event) {
    this.setParams($event);
    this.getHeiSummary(this.params);
  }

  public setParams(filterParams: any) {
     this.params = {
      'startDate': filterParams.startDate,
      'endDate': filterParams.endDate,
      'locationUuids': this.locations,
      'displayTabluarFilters': true
     };

  }

  public loading() {
    this.busyIndicator = {
      busy: true,
      message: 'Fetching report...please wait'
    };
  }

  public endLoading() {
    this.busyIndicator = {
      busy: false,
      message: ''
    };
  }

  public getHeiSummary(params: any) {
     this.loading();
     this._heiReportService.getHeiIndicatorsReport(params).subscribe((result: any) => {
       if (result) {
         this.heiSummary = result.result;
         this.sectionDefs = result.sectionDefinitions;
         this.endLoading();
       }
     }, (err) => {
      this.endLoading();
      this.errorObj = {
        'isError': true,
        'message': err.error.message ? err.error.message : ''
      };
    });

  }

  public onTabChanged($event) {
  }

  public setCellSelection($event, $event2) {
    this.viewPatientList($event);
  }

  public viewPatientList(data) {
    const params: any = {
        locationUuids: data.location,
        indicators: data.field,
        startDate: this.params.startDate,
        endDate: this.params.endDate
    };

    this._router.navigate(['./patient-list']
        , {
            relativeTo: this._route,
            queryParams: params
        });
   }


}
