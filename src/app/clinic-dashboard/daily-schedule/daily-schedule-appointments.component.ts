import { Component, OnInit, OnChanges, Input, SimpleChange, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
  DailyScheduleResourceService
} from
  '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject } from 'rxjs/Rx';
@Component({
  selector: 'daily-schedule-appointments',
  templateUrl: './daily-schedule-appointments.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleAppointmentsComponent implements OnInit, OnChanges {

  @Input() selectedDate: any;
  errors: any[] = [];
  dailyAppointmentsPatientList: any[] = [];
  loadingDailyAppointments: boolean = false;
  dataLoaded: boolean = false;
  dataAppLoaded: boolean = true;
  selectedTab: any;
  selectedClinic: any;
  nextStartIndex: number = 0;
  @Input() tab: any;
  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  private _data = new BehaviorSubject<any>([]);
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
    private dailyScheduleResource: DailyScheduleResourceService) {
  }

  ngOnInit() {
    this._data
      .subscribe(x => {
        this.selectedTab = x;
        let params = this.getQueryParams(this.selectedDate, this.selectedClinic);
        if (this.selectedDate && this.selectedClinic && this.selectedTab === 0) {
          this.getDailyAppointments(params);
        }

      });

    this.clinicDashboardCacheService.getCurrentClinic().subscribe((location) => {
      this.selectedClinic = location;
      let params = this.getQueryParams(this.selectedDate, this.selectedClinic);

      if (this.selectedDate && this.selectedClinic && this.selectedTab === 0) {
        this.initParams();
        this.getDailyAppointments(params);
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
      if (!changedProp.isFirstChange()) {
        let params = this.getQueryParams(newDate, this.selectedClinic);
        if (newDate && this.selectedClinic && this.selectedTab === 0) {
          this.initParams();
          this.getDailyAppointments(params);
        }

      }
    }
  }

  public getQueryParams(selectedDate, selectedLocation) {
    return {
      startDate: selectedDate,
      startIndex: this.nextStartIndex,
      locationUuids: selectedLocation,
      limit: undefined
    };

  }

  public getDailyAppointments(params) {
    let result = this.dailyScheduleResource.
      getDailyAppointments(params);
    if (result === null) {
      throw 'Null daily appointments observable';
    } else {
      result.subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            this.dailyAppointmentsPatientList = this.dailyAppointmentsPatientList.concat(
              patientList);
            let size: number = patientList.length;
            this.nextStartIndex = this.nextStartIndex + size;
          } else {
            this.dataLoaded = true;
          }
          this.loadingDailyAppointments = false;

        }
        ,
        (error) => {
          this.loadingDailyAppointments = false;

          this.errors.push({
            id: 'Daily Schedule Appointments',
            message: 'error fetching daily schedule appointments'
          });
        }
      );
    }
  }

  loadMoreAppointments() {
    this.loadingDailyAppointments = true;
    let params = this.getQueryParams(this.selectedDate, this.selectedClinic);
    this.getDailyAppointments(params);
  }

  initParams() {
    this.loadingDailyAppointments = true;
    this.dataLoaded = false;
    this.errors = [];
    this.dailyAppointmentsPatientList = [];
  }

}
