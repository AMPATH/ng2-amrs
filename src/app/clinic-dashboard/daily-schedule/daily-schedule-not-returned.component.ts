import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';

import {
  DailyScheduleResourceService
} from
  '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
@Component({
  selector: 'daily-schedule-not-returned',
  templateUrl: './daily-schedule-not-returned.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleNotReturned implements OnInit, OnDestroy {



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
  private currentClinicSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  private visitsSubscription: Subscription;
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
    this.selectedDate = Moment().format('YYYY-MM-DD');
    this.currentClinicSubscription = this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
        if (this.selectedClinic) {
          this.selectedDateSubscription = this.clinicDashboardCacheService.
            getDailyTabCurrentDate().subscribe((date) => {
              this.selectedDate = date;
              this.initParams();
              let params = this.getQueryParams();
              this.getDailyHasNotReturned(params);
            });

        }
      });
  }

  ngOnDestroy(): void {

  }
  loadMoreNotReturned() {
    this.loadingDailyNotReturned = true;

    let params = this.getQueryParams();
    this.getDailyHasNotReturned(params);
  }

  private initParams() {
    this.loadingDailyNotReturned = true;
    this.dataLoaded = false;
    this.nextStartIndex = 0;
    this.errors = [];
    this.notReturnedPatientList = [];
  }


  private getQueryParams() {
    return {
      startDate: this.selectedDate,
      startIndex: this.nextStartIndex,
      locationUuids: this.selectedClinic,
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
