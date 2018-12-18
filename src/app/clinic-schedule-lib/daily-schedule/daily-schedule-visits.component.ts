import { Component, OnInit, OnDestroy, OnChanges, Input,
SimpleChange, EventEmitter } from '@angular/core';
import {
  ClinicDashboardCacheService
} from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { DailyScheduleResourceService } from '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as Moment from 'moment';
import { LocalStorageService } from './../../utils/local-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'daily-schedule-visits',
  templateUrl: './daily-schedule-visits.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleVisitsComponent implements OnInit, OnDestroy {

  @Input() public selectedDate: any;
  public errors: any[] = [];
  public dailyVisitsPatientList: any[] = [];
  public loadingDailyVisits = false;
  public dataLoaded  = false;
  public currentTabLoaded = false;
  public selectedVisitTab: any;
  public nextStartIndex  = 0;
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public params: any = {
    'programType': [],
    'visitType': [],
    'encounterType': []
  };
  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public fetchCount  = 0;
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
  private subs: Subscription[] = [];
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private dailyScheduleResource: DailyScheduleResourceService,
              private localStorageService: LocalStorageService,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.selectedDate = Moment().format('YYYY-MM-DD');
    const sub = this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
      });
    this.subs.push(sub);

    const routeSub = this.route
      .queryParams
      .subscribe((params) => {
        if (params) {
          if (params.programType) {
            this.initParams();
            this.params = params;
            const searchParams = this.getQueryParams();
            if (params.resetFilter && params.resetFilter === 'true') {
                this.dailyVisitsPatientList = [];
            } else {
               this.getDailyVisits(searchParams);
            }
          } else {
            this.dailyVisitsPatientList = [];
          }

        }
      });
    this.subs.push(routeSub);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public loadMoreVisits() {

    this.loadingDailyVisits = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    const params = this.getQueryParams();
    this.getDailyVisits(params);

  }

  public getQueryParams() {
    let programType: any = [];
    let visitType: any = [];
    let encounterType: any = [];
    if (this.params.programType.length > 0) {
        programType = this.params.programType;
    }
    if (this.params.visitType && this.params.visitType.length > 0) {
      visitType = this.params.visitType;
    }
    if (this.params.encounterType && this.params.encounterType.length > 0) {
      encounterType = this.params.encounterType;
    }
    if (this.params.startDate) {

      this.selectedDate = this.params.startDate;

    } else {
       this.selectedDate = Moment().format('YYYY-MM-DD');
    }
    return {
      startDate: this.selectedDate,
      startIndex: 0,
      locationUuids: this.selectedClinic,
      programType: programType,
      visitType: visitType,
      encounterType: encounterType,
      limit: 1000
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
    this.setBusy();
    this.loadingDailyVisits = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    const result = this.dailyScheduleResource.
      getDailyVisits(params);

    if (result === null) {
      throw new Error('Null daily appointments observable');
    } else {
      result.subscribe(
        (patientList) => {
          if (patientList) {
            this.dailyVisitsPatientList = patientList;
            this.currentTabLoaded = true;
            this.dataLoaded = true;
          } else {
            this.dataLoaded = true;
          }
          this.setFree();
          this.loadingDailyVisits = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
        }
        ,
        (error) => {
          this.setFree();
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

  private setBusy() {

    this.busyIndicator = {
      busy: true,
      message: 'Please wait...Loading'
    };

  }
  private setFree() {

    this.busyIndicator = {
      busy: false,
      message: ''
    };

  }

}
