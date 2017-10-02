import { LocalStorageService } from './../../utils/local-storage.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DailyScheduleResourceService } from '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { CookieService } from 'ngx-cookie';
import * as Moment from 'moment';

@Component({
  selector: 'daily-schedule-appointments',
  templateUrl: './daily-schedule-appointments.component.html',
  styleUrls: ['./daily-schedule.component.css']
})

export class DailyScheduleAppointmentsComponent implements OnInit, OnDestroy {

  @Input() public selectedDate: any;
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public encodedParams: string =  encodeURI(JSON.stringify(this.filter));
  public errors: any[] = [];
  public dailyAppointmentsPatientList: any[] = [];
  public loadingDailyAppointments: boolean = false;
  public dataLoaded: boolean = false;
  public dataAppLoaded: boolean = true;
  public selectedClinic: any;
  public nextStartIndex: number = 0;
  @Input() public tab: any;
  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  private _data = new BehaviorSubject<any>([]);
  private currentClinicSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  private appointmentSubscription: Subscription;
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private dailyScheduleResource: DailyScheduleResourceService,
              private _cookieService: CookieService,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
    this.filterSelected();
    this.selectedDate = Moment().format('YYYY-MM-DD');
    this.currentClinicSubscription = this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
        if (this.selectedClinic) {
          this.selectedDateSubscription = this.clinicDashboardCacheService.
            getDailyTabCurrentDate().subscribe((date) => {
            if ( this.loadingDailyAppointments === false) {
              this.selectedDate = date;

              this.initParams();
              let params = this.getQueryParams();
              console.log('Appointment Params', params);
              this.getDailyAppointments(params);
            }

          });
        }

      });
  }

  public ngOnDestroy(): void {
    if (this.currentClinicSubscription) {
      this.currentClinicSubscription.unsubscribe();
    }
    if (this.selectedDateSubscription) {
      this.selectedDateSubscription.unsubscribe();
    }
    if (this.appointmentSubscription) {
      this.appointmentSubscription.unsubscribe();
    }

  }

  public getDailyAppointments(params) {
    console.log('get Appointments');
    this.loadingDailyAppointments = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyAppointments);

    let result = this.dailyScheduleResource.
      getDailyAppointments(params);
    if (result === null) {
      throw new Error('Null daily appointments observable');
    } else {
      this.appointmentSubscription = result.subscribe(
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
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyAppointments);

        }
        ,
        (error) => {
          this.loadingDailyAppointments = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyAppointments);

          this.errors.push({
            id: 'Daily Schedule Appointments',
            message: 'error fetching daily schedule appointments'
          });
        }
      );
    }
  }

  public loadMoreAppointments() {
    this.loadingDailyAppointments = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyAppointments);
    let params = this.getQueryParams();
    this.getDailyAppointments(params);

  }

  private initParams() {
    this.loadingDailyAppointments = false;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyAppointments);
    this.nextStartIndex = 0;
    this.dataLoaded = false;
    this.errors = [];
    this.dailyAppointmentsPatientList = [];
  }

  private getQueryParams() {
    this.filterSelected();
    return {
      startDate: this.selectedDate,
      startIndex: this.nextStartIndex,
      locationUuids: this.selectedClinic,
      programVisitEncounter: this.encodedParams,
      limit: undefined
    };

  }

  private filterSelected() {
      let cookieKey = 'programVisitEncounterFilter';

      let cookieVal =  encodeURI(JSON.stringify(this.encodedParams));

      let programVisitCookie = this._cookieService.get(cookieKey);

      if (typeof programVisitCookie === 'undefined') {

      } else {

         cookieVal =  this.localStorageService.getItem(cookieKey);

         // this._cookieService.put(cookieKey, cookieVal);
      }

      this.encodedParams = cookieVal;

  }
}
