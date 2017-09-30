import { Component, OnInit, OnDestroy, OnChanges, Input,
SimpleChange, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DailyScheduleResourceService } from '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
import { CookieService } from 'ngx-cookie';
import { LocalStorageService } from './../../utils/local-storage.service';
@Component({
  selector: 'daily-schedule-visits',
  templateUrl: './daily-schedule-visits.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleVisitsComponent implements OnInit, OnDestroy {

  @Input() public selectedDate: any;
  public errors: any[] = [];
  public dailyVisitsPatientList: any[] = [];
  public loadingDailyVisits: boolean = false;
  public dataLoaded: boolean = false;
  public currentTabLoaded: boolean = false;
  public selectedVisitTab: any;
  public nextStartIndex: number = 0;
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public encodedParams: string =  encodeURI(JSON.stringify(this.filter));
  @Input() public tab: any;
  @Input() public newList: any;

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
              private dailyScheduleResource: DailyScheduleResourceService,
              private _cookieService: CookieService,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
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
              console.log('Visit Params', params);
              this.getDailyVisits(params);
            }

            });

        }
      });
  }

  public ngOnDestroy(): void {
    this.currentClinicSubscription.unsubscribe();
  }

  public loadMoreVisits() {

    this.loadingDailyVisits = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    let params = this.getQueryParams();
    this.getDailyVisits(params);

  }

  public getQueryParams() {
    this.filterSelected();
    return {
      startDate: this.selectedDate,
      startIndex: this.nextStartIndex,
      locationUuids: this.selectedClinic,
      programVisitEncounter: this.encodedParams,
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
      throw new Error('Null daily appointments observable');
    } else {
      this.visitsSubscription = result.subscribe(
        (patientList) => {
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

    private filterSelected() {
      let cookieKey = 'programVisitEncounterFilter';

      let cookieVal = encodeURI(JSON.stringify(this.encodedParams));

      let programVisitCookie = this._cookieService.get(cookieKey);

      console.log('Cookie val', programVisitCookie);

      if (typeof programVisitCookie === 'undefined') {

      } else {

        cookieVal =  this.localStorageService.getItem(cookieKey);

        // this._cookieService.put(cookieKey, cookieVal);
      }

      this.encodedParams = cookieVal;
  }

}
