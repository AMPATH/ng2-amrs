import { Component, OnDestroy, OnInit , Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
import * as Moment from 'moment';
import { MonthlyScheduleResourceService } from '../../etl-api/monthly-scheduled-resource.service';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { CookieService } from 'ngx-cookie';
import * as _ from 'lodash';
import { PatientProgramResourceService } from './../../etl-api/patient-program-resource.service';
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
export class MonthlyScheduleComponent implements OnInit, OnDestroy {
  public viewDate: Date = new Date();
  public view = 'month';
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public encodedParams: string = '';
  public events: CalendarEvent[] = [];
  public activeDayIsOpen: boolean = false;
  public location: string = '';
  public busy: Subscription;
  public fetchError = false;
  public programVisitsEncounters: any = [];
  public encounterTypes: any [];
  public trackEncounterTypes: any = [];
  private subscription: Subscription = new Subscription();

  constructor(private monthlyScheduleResourceService: MonthlyScheduleResourceService,
              private clinicDashboardCacheService: ClinicDashboardCacheService,
              private router: Router,
              private route: ActivatedRoute, private appFeatureAnalytics: AppFeatureAnalytics,
              private _cookieService: CookieService,
              private _patientProgramService: PatientProgramResourceService) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Monthly Schedule', 'Monthly Schedule loaded', 'ngOnInit');
    let date = this.route.snapshot.queryParams['date'];
    if (date) {
      this.viewDate = new Date(date);
    }

    this.subscription = this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location: string) => {
        this.location = location;
        // this.getAppointments();
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public saveParamsToCookie() {

     let cookieKey = 'programVisitEncounterFilter';

     let cookieVal =  this.encodedParams;

     this._cookieService.put(cookieKey, cookieVal);

  }

  public filterSelected($event) {
         this.filter = $event;
         console.log('Event', $event);
         console.log('Fetch Appointments.....');
         this.getAppointments();
  }

  public getCurrentLocation() {
    // this.route.parent.params.subscribe(params => {
    //     this.location = params['location_uuid'];
    //  });

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

  public convertFilterToUri() {

  this.encodedParams = encodeURI(JSON.stringify(this.filter));

  console.log('Encode Monthly Filter Params', this.encodedParams);

}

  public getAppointments() {
      this.convertFilterToUri();
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

  public addBadgeTotal(day: CalendarMonthViewDay): void {
    day.badgeTotal = 0;
  }

  public navigateToDaily(event) {
    switch (event.type) {
      case 'scheduled':
        this.router.navigate(['clinic-dashboard',
            this.location, 'daily-schedule', 'daily-appointments'],
          {queryParams: {date: Moment(event.start).format('YYYY-MM-DD')}});
        break;
      case 'attended':
        this.router.navigate(['clinic-dashboard',
            this.location, 'daily-schedule', 'daily-visits'],
          {queryParams: {date: Moment(event.start).format('YYYY-MM-DD')}});
        break;
      case 'has_not_returned':
        this.router.navigate(['clinic-dashboard',
            this.location, 'daily-schedule', 'daily-not-returned'],
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
}
