import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DailyScheduleService } from './daily-appointments.service';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleComponent implements OnInit {



  errors: any[] = [];
  dailyVisits: any[] = [];
  loadingDailyVisits: boolean = false;
  dataLoaded: boolean = false;

  dailyAppointments: any[] = [];
  loadingDailyAppointments: boolean = false;
  dailyHasNotReturned: any[] = [];
  loadingHasNotReturned: boolean = false;


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

  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
    private dailyScheduleService: DailyScheduleService) {
  }

  ngOnInit() {
    this.clinicDashboardCacheService.getCurrentClinic().subscribe((location) => {
      console.log('Location', location);
      let params = {
        startDate: '2017-02-14',
        startIndex: undefined,
        locationUuids: '08feae7c-1352-11df-a1f1-0026b9348838',
        limit: undefined
      };
      this.getDailyAppointments(params);
      this.getDailyVisits(params);
      this.getHasNotReturned(params);
    });
  }




  public loadNotReturned() {
    console.log('NNNNNNNNNNNNNNnn ====');
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

  private getDailyAppointments(params) {
    this.loadingDailyAppointments = true;
    let request = this.dailyScheduleService.getDailyAppointments(params);
    this.loadingDailyAppointments = true;
    request
      .subscribe(
      (data) => {

        if (data.length > 0) {
          this.dailyAppointments = data;
          this.dataLoaded = true;
        } else {
          this.dataLoaded = false;
        }
        this.loadingDailyAppointments = false;

      },
      (error) => {
        this.loadingDailyVisits = false;
        this.dataLoaded = true;
        this.errors.push({
          id: 'Daily Appointments',
          message: 'error fetching daily appointments'
        });
      }
      );
  }

  private getDailyVisits(params) {
    this.loadingDailyVisits = true;
    let request = this.dailyScheduleService.getDailyVisits(params);
    request
      .subscribe(
      (data) => {

        if (data.length > 0) {
          this.dailyVisits = data;
          this.dataLoaded = true;
        } else {
          this.dataLoaded = false;
        }
        this.loadingDailyVisits = false;
      },
      (error) => {
        this.loadingDailyVisits = false;
        this.dataLoaded = true;
        this.errors.push({
          id: 'Daily Visits',
          message: 'error fetching daily visits'
        });
      }
      );
  }

  private getHasNotReturned(params) {
    this.loadingHasNotReturned = true;
    let request = this.dailyScheduleService.getDailyHasNotReturned(params);
    request
      .subscribe(
      (data) => {

        if (data.length > 0) {
          this.dailyHasNotReturned = data;
          this.dataLoaded = true;
        } else {
          this.dataLoaded = false;
        }
        this.loadingHasNotReturned = false;
      },
      (error) => {
        this.loadingHasNotReturned = false;
        this.dataLoaded = true;
        this.errors.push({
          id: 'Has Not Returned',
          message: 'error fetching Has Not Returned'
        });
      }
      );
  }

  private get diagnostic() {
    return JSON.stringify(this.reportFilter);
  }

  private get getDataToBind() {
    return JSON.stringify(this.dataToBind);
  }
}
