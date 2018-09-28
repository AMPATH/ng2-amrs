import { Component, OnDestroy, OnInit , Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';
import {
  startOfDay, endOfDay, subDays, addDays, endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfMonth
} from 'date-fns';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import * as Moment from 'moment';
import { MonthlyScheduleResourceService } from '../../etl-api/monthly-scheduled-resource.service';
import { ClinicDashboardCacheService }
  from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import * as _ from 'lodash';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#F0AD4E',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#5CB85C',
    secondary: '#FDF1BA'
  }
};
@Component({
  selector: 'app-monthly-schedule',
  templateUrl: './monthly-schedule.component.html',
  styleUrls: ['./monthly-schedule.component.css']
})
export class MonthlyScheduleBaseComponent implements OnInit, OnDestroy {
  public viewDate: Date = new Date();
  public view = 'month';
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public encodedParams: string =  encodeURI(JSON.stringify(this.filter));
  public events: CalendarEvent[] = [];
  public activeDayIsOpen: boolean = false;
  public location: string = '';
  public busy: Subscription;
  public fetchError = false;
  public programVisitsEncounters: any = [];
  public encounterTypes: any [];
  public trackEncounterTypes: any = [];
  public subscription: Subscription = new Subscription();
  private _datePipe: DatePipe;

  constructor(public monthlyScheduleResourceService: MonthlyScheduleResourceService,
              public clinicDashboardCacheService: ClinicDashboardCacheService,
              public router: Router,
              public route: ActivatedRoute,
              public appFeatureAnalytics: AppFeatureAnalytics,
              public _localstorageService: LocalStorageService,
              public _patientProgramService: PatientProgramResourceService) {
    this._datePipe = new DatePipe('en-US');
    this.getSavedFilter();
    this.getCurrentLocation();
    this.appFeatureAnalytics
      .trackEvent('Monthly Schedule', 'Monthly Schedule loaded', 'ngOnInit');
    let date = this.route.snapshot.queryParams['date'];
    if (date) {
      this.viewDate = new Date(date);
    }
    if (this.location) {
      this.getAppointments();
    }
  }

  public ngOnInit() {
    this.getAppointments();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public filterSelected($event) {
         this.filter = $event;
         this.encodedParams = encodeURI(JSON.stringify($event));
         this.getAppointments();
  }

  public getCurrentLocation() {
    this.clinicDashboardCacheService.getCurrentClinic().subscribe((location) => {
      this.location = location;
    });
  }

  public navigateToMonth() {
    let date = Moment(this.viewDate).format('YYYY-MM-DD');
    this.viewDate = new Date(date);
    this.router.navigate(['./'], {
      queryParams: {date: date},
      relativeTo: this.route
    });
    this.getAppointments();
  }

  public getAppointments() {
      this.fetchError = false;
      this.busy = this.monthlyScheduleResourceService.getMonthlySchedule({
      endDate: Moment(endOfMonth(this.viewDate)).format('YYYY-MM-DD'),
      startDate: Moment(startOfMonth(this.viewDate)).format('YYYY-MM-DD'),
      programVisitEncounter: this.encodedParams,
      locationUuids: this.location, limit: 10000
    }).subscribe((results) => {
      this.events = this.processEvents(results);
    }, (error) => {
      this.fetchError = true;
    });
  }

  public beforeMonthViewRender(days: CalendarMonthViewDay[]): void {
    days.forEach(day => {
      day.badgeTotal = 0;
    });
  }

  public navigateToDaily(event) {
    switch (event.type) {
      case 'scheduled':
        this.router.navigate(['clinic-dashboard',
            this.location, 'general', 'daily-schedule', 'daily-appointments'],
          {queryParams: {date: Moment(event.start).format('YYYY-MM-DD')}});
        break;
      case 'attended':
        this.router.navigate(['clinic-dashboard',
            this.location, 'general', 'daily-schedule', 'daily-visits'],
          {queryParams: {date: Moment(event.start).format('YYYY-MM-DD')}});
        break;
      case 'has_not_returned':
        this.router.navigate(['clinic-dashboard',
            this.location, 'general', 'daily-schedule', 'daily-not-returned'],
          {queryParams: {date: Moment(event.start).format('YYYY-MM-DD')}});
        break;
      default:
    }
  }

  public processEvents(results) {
    let processed = [];
    for (let e of results) {
      /* tslint:disable forin*/
      for (let key in e.count) {

        switch (key) {
          case 'scheduled':
            processed.push({
              start: new Date(e.date),
              type: 'scheduled',
              title: e.count[key],
              color: colors.blue,
              class: 'label label-info'
            });
            break;
          case 'attended':
            processed.push({
              start: new Date(e.date),
              title: e.count[key],
              color: colors.green,
              type: 'attended',
              class: 'label label-success'
            });
            break;
          case 'has_not_returned':
            if (e.count[key] > 0) {
              processed.push({
                start: new Date(e.date),
                title: e.count[key],
                color: colors.yellow,
                type: 'has_not_returned',
                class: 'label label-warning'
              });
            }
            break;
          default:
        }

      }
      /* tslint:enable */
    }
    return processed;
  }

  public dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

  }

  public dateChanged(event) {
    this.viewDate = event;
    this.navigateToMonth();
  }

  // get filter saved

  public getSavedFilter() {
      let cookieKey = 'programVisitEncounterFilter';

      let cookieVal =  encodeURI(JSON.stringify(this.encodedParams));

      let programVisitStored = this._localstorageService.getItem(cookieKey);

      if (programVisitStored === null) {

      } else {

         cookieVal =  this._localstorageService.getItem(cookieKey);

         // this._cookieService.put(cookieKey, cookieVal);
      }

      this.encodedParams = cookieVal;

  }
}
