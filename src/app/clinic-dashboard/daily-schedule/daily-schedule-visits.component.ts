import { Component, OnInit, OnChanges, Input, SimpleChange, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
  DailyScheduleResourceService
} from
  '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
@Component({
  selector: 'daily-schedule-visits',
  templateUrl: './daily-schedule-visits.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleVisitsComponent implements OnInit {

  @Input() selectedDate: any;
  errors: any[] = [];
  dailyVisitsPatientList: any[] = [];
  loadingDailyVisits: boolean = false;
  dataLoaded: boolean = false;
  currentTabLoaded: boolean = false;
  selectedVisitTab: any;
  nextStartIndex: number = 0;
  @Input() tab: any;
  @Input() newList: any;

  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  private _data = new BehaviorSubject<any>([]);
  private selectedClinic: any;
  private currentClinicSubscription: Subscription= new Subscription();
  private selectedDateSubscription: Subscription;
  private visitsSubscription: Subscription;
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
            if ( this.loadingDailyVisits === false) {
              this.selectedDate = date;
              this.initParams();
              let params = this.getQueryParams();
              this.getDailyVisits(params);
            }

            });

        }
      });
  }

  ngOnDestroy(): void {
    this.currentClinicSubscription.unsubscribe();
  }


  loadMoreVisits() {

    this.loadingDailyVisits = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    let params = this.getQueryParams();
    this.getDailyVisits(params);

  }

  public getQueryParams() {
    return {
      startDate: this.selectedDate,
      startIndex: this.nextStartIndex,
      locationUuids: this.selectedClinic,
      limit: undefined
    };

  }

  private initParams() {
    this.loadingDailyVisits = false;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    this.dataLoaded = false;
    this.nextStartIndex = 0;
    this.errors = [];
    this.dailyVisitsPatientList = [];
  }

  private getDailyVisits(params) {
    this.loadingDailyVisits = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    let result = this.dailyScheduleResource.
      getDailyVisits(params);

    if (result === null) {
      throw 'Null daily appointments observable';
    } else {
      this.visitsSubscription = result.subscribe(
        (patientList) => {
          console.log('Visits', patientList);
          if (patientList.length > 0) {
            this.dailyVisitsPatientList = this.dailyVisitsPatientList.concat(
              patientList);
            let size: number = patientList.length;
            this.nextStartIndex = this.nextStartIndex + size;
            this.currentTabLoaded = true;
          } else {
            this.dataLoaded = true;
          }
          this.loadingDailyVisits = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
        }
        ,
        (error) => {
          this.loadingDailyVisits = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
          this.dataLoaded = true;
          this.errors.push({
            id: 'Daily Visits',
            message: 'error fetching daily visits'
          });
        }
      );
    }
  }

}
