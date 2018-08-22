import { Component,
    OnInit , OnDestroy , AfterViewInit,
    Output , EventEmitter, Input , ChangeDetectorRef,
    ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { DataEntryStatisticsService } from
'../etl-api/data-entry-statistics-resource.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'data-entry-statistics',
  templateUrl: './data-entry-statistics.component.html',
  styleUrls: ['./data-entry-statistics.component.css']
})
export class DataEntryStatisticsComponent
  implements OnInit, OnDestroy, AfterViewInit {

  public busyIndicator: any = {
      busy: false,
      message: 'Please wait...' // default message
  };
  public params: any = [];

  public providerResult = new Subject<string>();
  public showDataEntryStats: boolean = false;
  public showPatientList: boolean = false;
  public patientListParams: any;

  public dataEntryEncounters: any = [];
  public viewTypes: any = [];
  public subType: any = [];
  public view: any = [];

  constructor(
    private _cd: ChangeDetectorRef,
    private _dataEntryStatisticsService: DataEntryStatisticsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit() {
  }

  public ngOnDestroy() {}

  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public selectedFilterParams($event) {

    this.params = $event;
    this.getDataEntryStats();

  }

  public selectedView($event) {
    this.view = $event;
  }

  public resetFilter($event) {
    this.resetAllStats();
  }

  public getDataEntryStats() {

   this.busyIndicator = {
     busy: true,
     message: 'Fetching data...please wait' // default message

   };

   this.showEncounterList();
   this._dataEntryStatisticsService.getDataEntryStatistics(this.params)
   .subscribe((results) => {
       if (results) {
        this.dataEntryEncounters = results;
        this.busyIndicator = {
          busy: false,
          message: ''
        };
       }
   });

}

public resetAllStats() {
  this.dataEntryEncounters = [];

}
public encounterPatientList($event: any) {
  this.getEncounterPatientList($event);

}

// show data entry stats
public  showEncounterList() {

    this.showDataEntryStats = true;
    this.showPatientList = false;
}

public showPatientListData() {

  this.showDataEntryStats = false;
  this.showPatientList = true;

}

public getEncounterPatientList(patientListParams) {

      this._router.navigate(['patient-list']
     , {
          relativeTo: this._route,
             queryParams: patientListParams
            });

}

}
