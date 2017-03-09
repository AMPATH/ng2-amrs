import { Component, OnInit, OnChanges, Input, SimpleChange, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';

import {
  DailyScheduleResourceService
} from
  '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'daily-schedule-not-returned',
  templateUrl: './daily-schedule-not-returned.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleNotReturned implements OnInit, OnChanges {

  @Input() selectedDate: any;
  @Input() tab: any;
  @Input() newList: any;

  errors: any[] = [];
  notReturnedPatientList: any[] = [];
  loadingDailyNotReturned: boolean = false;
  currentTabLoaded: boolean = false;
  dataLoaded: boolean = false;
  nextStartIndex: number = 0;
  selectedNotReturnedTab: any;
  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  private _data = new BehaviorSubject<any>([]);
  private selectedClinic: any;

  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
    private dailyScheduleResource: DailyScheduleResourceService) {
  }

  ngOnInit() {

    this._data
      .subscribe(x => {
        this.selectedNotReturnedTab = x;
        console.log(' this.selectedTab this.selectedTab==', this.selectedNotReturnedTab);
        let params = this.getQueryParams(this.selectedDate, this.selectedClinic);
        if (this.selectedDate && this.selectedClinic && this.selectedNotReturnedTab === 2
        ) {
          this.initParams();
          this.getDailyHasNotReturned(params);
        }

      });


    this.clinicDashboardCacheService.getCurrentClinic().subscribe((location) => {
      this.selectedClinic = location;
      let params = this.getQueryParams(this.selectedDate, this.selectedClinic);
      if (this.selectedDate && this.selectedClinic && this.selectedNotReturnedTab === 2) {
        this.initParams();
        this.getDailyHasNotReturned(params);
      }

    });
  }



  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName !== 'selectedDate') {
        continue;
      }
      let changedProp = changes[propName];
      let newDate = changedProp.currentValue;
      if (propName === 'selectedDate') {
        if (!changedProp.isFirstChange()) {
          let params = this.getQueryParams(newDate, this.selectedClinic);
          if (newDate && this.selectedClinic) {
            this.initParams();
            this.getDailyHasNotReturned(params);
          }

        }
      }


    }
  }

  loadMoreNotReturned() {
    this.loadingDailyNotReturned = true;

    let params = this.getQueryParams(this.selectedDate, this.selectedClinic);
    this.getDailyHasNotReturned(params);
  }

  private initParams() {
    this.loadingDailyNotReturned = true;
    this.dataLoaded = false;
    this.errors = [];
    this.notReturnedPatientList = [];
  }


  private getQueryParams(selectedDate, selectedLocation) {
    return {
      startDate: selectedDate,
      startIndex: this.nextStartIndex,
      locationUuids: selectedLocation,
      limit: undefined
    };

  }
  private getDailyHasNotReturned(params) {
    this.loadingDailyNotReturned = true;
    let result = this.dailyScheduleResource.
      getDailyHasNotReturned(params);

    if (result === null) {
      throw 'Null daily not returned';
    } else {
      result.subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            this.notReturnedPatientList = this.notReturnedPatientList.concat(
              patientList);
            let size: number = patientList.length;
            this.nextStartIndex = this.nextStartIndex + size;
            this.currentTabLoaded = true;
          } else {
            this.dataLoaded = true;
          }
          this.loadingDailyNotReturned = false;
        }
        ,
        (error) => {
          this.loadingDailyNotReturned = false;
          this.dataLoaded = true;
          this.errors.push({
            id: 'Daily Schedule Has Not Returned',
            message: 'error fetching daily schedule  has not returned'
          });
        }
      );
    }
  }

}
