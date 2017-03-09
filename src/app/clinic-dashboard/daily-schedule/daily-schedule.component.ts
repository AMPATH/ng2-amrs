import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DatePipe } from '@angular/common';
import * as Moment from 'moment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleComponent implements OnInit {
  errors: any[] = [];
  selectedDate: any;
  selectedLocation: any;
  selectedTab: any;
  selectedVisit: boolean = false;
  selectedAppointments: boolean = true;
  selectedNotReturned: boolean = false;
  @Output() selectedSchedule = new EventEmitter();
  private msgs: Message[] = [];
  private reportFilter: any = { ageRange: [40, 70] };
  private dataToBind: any = {
    ageRange: [0, 15],
    selectedGender: 'M,F',
    selectedLocations: ['cb31d052-b668-4321-80ad-c0aaa571f87b'],
    startDate: new Date('10/05/2016'),
    endDate: new Date('10/11/2016'),
    selectedIndicators: ['on_arvs', 'on_arvs_first_line']
  };

  private _datePipe: DatePipe;
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
    private router: Router) {
    this._datePipe = new DatePipe('en-US');
  }

  handleChange(e) {
    let index = e.index;
    this.clinicDashboardCacheService.setCurrentTab(index);
    this.selectedSchedule.emit(index);
    if (!e.index) {
      this.selectedTab = 0;
    } {
      this.selectedTab = index;
    }
    let link;
    switch (index) {
      case 0:
        link = ['/clinic-dashboard/' + this.selectedLocation
          + '/daily-schedule/daily-appointments'];
        break;
      case 1:
        link = ['/clinic-dashboard/' + this.selectedLocation
          + '/daily-schedule/daily-visits'];
        break;
      case 2:
        link = ['/clinic-dashboard/' + this.selectedLocation
          + '/daily-schedule/daily-not-returned'];
        break;
      default:
    }
    this.router.navigate(link);
  }

  ngOnInit() {
    this.selectedSchedule.emit(0);
    if (!this.selectedTab) {
      this.selectedTab = 0;
    }

    this.clinicDashboardCacheService.getCurrentClinic().subscribe((location) => {
      console.log('Location', location);
      this.selectedLocation = location;

    });
    this.selectedDate = this._datePipe.transform(
      new Date(), 'yyyy-MM-dd');
  }

  public onGenerateReport(event: any) {
    console.log(event, this.reportFilter);
    this.msgs = [];
    this.msgs.push({
      severity: 'info',
      summary: 'Success',
      detail: 'You have invoked generateRpt Fx from  parent cmpnt'
    });
  }

  public navigateDay(value) {
    if (value) {
      let m = Moment(new Date(this.selectedDate));
      let revisedDate = m.add(value, 'd');

      this.selectedDate = this._datePipe.transform(
        revisedDate, 'yyyy-MM-dd');
    }
  }

  private get diagnostic() {
    return JSON.stringify(this.reportFilter);
  }

  private get getDataToBind() {
    return JSON.stringify(this.dataToBind);
  }
}
