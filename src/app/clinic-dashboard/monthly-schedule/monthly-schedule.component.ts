import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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
    primary: '#e3bc08',
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
export class MonthlyScheduleComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  busy: Subscription;
  constructor(private monthlyScheduleResourceService: MonthlyScheduleResourceService,
    private clinicDashboardCacheService: ClinicDashboardCacheService) { }

  ngOnInit() {
    this.clinicDashboardCacheService.getCurrentClinic().subscribe((location) => {
      this.busy = this.monthlyScheduleResourceService.getMonthlySchedule({
        endDate: Moment(endOfMonth(new Date())).format('YYYY-MM-DD'),
        startDate: Moment(startOfMonth(new Date())).format('YYYY-MM-DD'),
        locationUuids: location, limit: 10000
      }).subscribe((results) => {
        let processed = [];
        for (let e of results) {
          /* tslint:disable for-in*/
          for (let key in e.count) {

            switch (key) {
              case 'scheduled':
                processed.push({
                  start: new Date(e.date),
                  title: 'Scheduled ' + e.count[key],
                  color: colors.blue
                });
                break;
              case 'attended':
                processed.push({
                  start: new Date(e.date),
                  title: 'Attended ' + e.count[key],
                  color: colors.green
                });
                break;
              case 'has_not_returned':
                if (e.count[key] > 0) {
                  processed.push({
                    start: new Date(e.date),
                    title: 'Not attended ' + e.count[key],
                    color: colors.yellow
                  });
                }
                break;
              default:
            }

          }
          this.events = processed;
        }
        /* tslint:enable */
      });
    });
  }
  addBadgeTotal(day: CalendarMonthViewDay): void {
    day.badgeTotal = 0;
  }

  handleEvent() {

  }

  dayClicked({date, events}: { date: Date, events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
}
