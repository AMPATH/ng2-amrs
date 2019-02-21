
import {take} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import {
  ClinicDashboardCacheService
} from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { DailyScheduleResourceService } from '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as Moment from 'moment';
import { LocalStorageService } from './../../utils/local-storage.service';
import { ActivatedRoute } from '@angular/router';
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
  public loadingDailyNotReturned = false;
  public currentTabLoaded = false;
  public dataLoaded = false;
  public nextStartIndex = 0;
  public selectedNotReturnedTab: any;
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
  public encodedParams: string =  encodeURI(JSON.stringify(this.filter));
  public extraColumns: any = {
    headerName: 'Phone Number',
    width: 80,
    field: 'phone_number'
  };
  public fetchCount = 0;
  private subs: Subscription[] = [];
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

     const sub2 = this.route
       .queryParams
       .subscribe((params) => {
         if (params.programType) {
             this.params = params;
             if (params.resetFilter && params.resetFilter === 'true') {
              this.notReturnedPatientList = [];
             } else {
              this.initParams();
              const searchParams = this.getQueryParams();
              this.getDailyHasNotReturned(searchParams);
             }
          } else {
            this.notReturnedPatientList = [];
        }
       });

       this.subs.push(sub2);
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
  public loadMoreNotReturned() {

    this.loadingDailyNotReturned = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);

    const params = this.getQueryParams();
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
  private getDailyHasNotReturned(params) {
    this.setBusy();
    this.loadingDailyNotReturned = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);
    const result = this.dailyScheduleResource.
      getDailyHasNotReturned(params);

    if (result === null) {
      throw new Error('Null daily not returned');
    } else {
      result.pipe(take(1)).subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            this.notReturnedPatientList = patientList;
            this.dataLoaded = true;
            this.currentTabLoaded = true;
          } else {
            this.dataLoaded = true;
          }
          this.setFree();
          this.loadingDailyNotReturned = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyNotReturned);
        }
        ,
        (error) => {
          this.setFree();
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
