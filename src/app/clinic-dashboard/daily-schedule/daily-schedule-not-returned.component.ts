import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DailyScheduleResourceService } from '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
import { CookieService } from 'ngx-cookie';
import { LocalStorageService } from './../../utils/local-storage.service';
@Component({
  selector: 'daily-schedule-not-returned',
  templateUrl: './daily-schedule-not-returned.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleNotReturnedComponent implements OnInit, OnDestroy {
  @Input() public selectedDate: any;
  @Input() public tab: any;
  @Input() public newList: any;
  public errors: any[] = [];
  public notReturnedPatientList: any[] = [];
  public loadingDailyNotReturned: boolean = false;
  public currentTabLoaded: boolean = false;
  public dataLoaded: boolean = false;
  public nextStartIndex: number = 0;
  public selectedNotReturnedTab: any;
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public encodedParams: string =  encodeURI(JSON.stringify(this.filter));
  public extraColumns: any = {
    headerName: 'Phone Number',
    width: 80,
    field: 'phone_number'
  };
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
              if (this.loadingDailyNotReturned === false) {
                this.selectedDate = date;
                this.initParams();
                let params = this.getQueryParams();
                console.log('Has not Returned Visit Params', params);
                this.getDailyHasNotReturned(params);
              }

            });

        }
      });
  }

  public ngOnDestroy(): void {

  }
  public loadMoreNotReturned() {

    this.loadingDailyNotReturned = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);

    let params = this.getQueryParams();
    this.getDailyHasNotReturned(params);
  }

  private initParams() {
    this.loadingDailyNotReturned = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);

    this.dataLoaded = false;
    this.nextStartIndex = 0;
    this.errors = [];
    this.notReturnedPatientList = [];
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
  private getDailyHasNotReturned(params) {
    this.loadingDailyNotReturned = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);
    let result = this.dailyScheduleResource.
      getDailyHasNotReturned(params);

    if (result === null) {
      throw new Error('Null daily not returned');
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
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);
        }
        ,
        (error) => {
          this.loadingDailyNotReturned = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);
          this.dataLoaded = true;
          this.errors.push({
            id: 'Daily Schedule Has Not Returned',
            message: 'error fetching daily schedule  has not returned'
          });
        }
      );
    }
  }

    private filterSelected() {

      let cookieKey = 'programVisitEncounterFilter';

      let cookieVal =  encodeURI(JSON.stringify(this.encodedParams));

      let programVisitCookie = this._cookieService.get(cookieKey);

      console.log('Cookie val', programVisitCookie);

      if (typeof programVisitCookie === 'undefined') {

      } else {

         cookieVal =  this.localStorageService.getItem(cookieKey);

         // this._cookieService.put(cookieKey, cookieVal);
      }

      console.log('Daily Has not returned Cookie val', cookieVal);

      this.encodedParams = cookieVal;

  }

}
