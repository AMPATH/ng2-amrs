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
  public fetchCount: number = 0;
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
     this.filterSelected();
     this.selectedDate = Moment().format('YYYY-MM-DD');
     const sub = this.clinicDashboardCacheService.getCurrentClinic()
       .subscribe((location) => {
         this.selectedClinic = location;
         if (this.selectedClinic) {
           const dateSub = this.clinicDashboardCacheService.
             getDailyTabCurrentDate().subscribe((date) => {
               if (this.loadingDailyNotReturned === false) {
                 this.selectedDate = date;
                 this.initParams();
                 let params = this.getQueryParams();
                 this.getDailyHasNotReturned(params);
               }

             });
            this.subs.push(dateSub);
         }
       });

      this.subs.push(sub);

     const sub2 = this.route
       .queryParams
       .subscribe((params) => {
         if (params) {
           if (this.fetchCount === 0 ) {
            /*
            for intial page load do not fetch daily visits as
            it has been already fetched
            */

          }else {
             let searchParams = this.getQueryParams();
             this.initParams();
             this.getDailyHasNotReturned(searchParams);
          }
           this.fetchCount++;
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
      result.take(1).subscribe(
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

      let programVisitStored = this.localStorageService.getItem(cookieKey);

      if (programVisitStored === null) {

      } else {

         cookieVal =  this.localStorageService.getItem(cookieKey);

         // this._cookieService.put(cookieKey, cookieVal);
      }

      this.encodedParams = cookieVal;

  }

}
