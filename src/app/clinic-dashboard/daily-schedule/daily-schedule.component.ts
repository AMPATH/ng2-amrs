import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DatePipe } from '@angular/common';
import * as Moment from 'moment';
import { Router } from '@angular/router';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleComponent implements OnInit {
  errors: any[] = [];
  selectedDate: any;
  selectedLocation: any;
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
  private dateOptions: IMyOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };

  // Initialized to specific date (09.10.2018)
  private model: Object = {
    date: {
      year: Moment().year(), month: Moment().format('MMMM'),
      day: Moment().format('DD')
    }
  };
  private activeLinkIndex = 0;
  private tabLinks = [
    { label: 'Appointments', link: 'daily-appointments' },
    { label: 'Visits', link: 'daily-visits' },
    { label: 'Has not returned', link: 'daily-not-returned' },
  ];
  private _datePipe: DatePipe;
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
    private router: Router) {
    this._datePipe = new DatePipe('en-US');

  }
  ngOnInit() {
    this.selectedDate = this._datePipe.transform(
      new Date(), 'yyyy-MM-dd');
  }
  onDateChanged(event: IMyDateModel): void {
    // date selected
    this.clinicDashboardCacheService.setDailyTabCurrentDate(event.date);
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

      this.model = {
        date: {
          year: revisedDate.year(), month: revisedDate.format('MMMM'),
          day: revisedDate.format('DD')
        }
      };
      this.selectedDate = this._datePipe.transform(
        revisedDate, 'yyyy-MM-dd');
      this.clinicDashboardCacheService.setDailyTabCurrentDate(this.selectedDate);
    }
  }

  private get diagnostic() {
    return JSON.stringify(this.reportFilter);
  }

  private get getDataToBind() {
    return JSON.stringify(this.dataToBind);
  }
}
