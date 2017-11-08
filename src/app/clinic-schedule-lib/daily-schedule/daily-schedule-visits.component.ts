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
import { PatientListService } from '../../shared/services/patient-list.service';

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
  public patienListExtraColumns: any;
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public encodedParams: string =  encodeURI(JSON.stringify(this.filter));
  public fetchCount: number = 0;
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
              private localStorageService: LocalStorageService,
              private route: ActivatedRoute,
              private patientListService: PatientListService) {
  }

  public ngOnInit() {
    this.selectedDate = Moment().format('YYYY-MM-DD');
    this.currentClinicSubscription = this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
        if (this.selectedClinic) {
          this.selectedDateSubscription = this.clinicDashboardCacheService.
          getDailyTabCurrentDate().subscribe((date) => {
            if (this.loadingDailyVisits === false) {
              this.selectedDate = date;
              this.initParams();
              let params = this.getQueryParams();
              this.getDailyVisits(params);
            }

          });

        }
      });

    this.route
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
            this.getDailyVisits(searchParams);
          }
          this.fetchCount++;

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
            this.formatDateField(this.dailyVisitsPatientList);
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
      this.patienListExtraColumns = [
        {
          headerName: 'Phone Number',
          field: 'phone_number',
          width: 100,
          cellStyle: {
            'white-space': 'normal'
          }
        },
        {
          headerName: 'Last VL Result',
          field: 'vl_1',
          width: 100,
          cellStyle: {
            'white-space': 'normal'
          }
        },
        {
          headerName: 'Last VL Date',
          field: 'vl_1_date',
          width: 100,
          cellStyle: {
            'white-space': 'normal'
          }
        },
      ];
    }
  }

    private filterSelected() {
      let cookieKey = 'programVisitEncounterFilter';

      let cookieVal = encodeURI(JSON.stringify(this.encodedParams));

      let programVisitStored = this.localStorageService.getItem(cookieKey);

      if (programVisitStored === null) {

      } else {

        cookieVal =  this.localStorageService.getItem(cookieKey);

        // this._cookieService.put(cookieKey, cookieVal);
      }

      this.encodedParams = cookieVal;
  }
  private formatDateField(result) {
    let appointmentResult = [];
    for (const i of result) {
      let data = i;
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
          if (data.vl_1_date !== null) {
            let dateResulted = Moment(data.vl_1_date).format('YYYY-MM-DD');
            let rtc = Moment(data.rtc_date).format('YYYY-MM-DD');
            data['vl_1_date'] = dateResulted;
            data['rtc_date'] = rtc;
          }

          if (data.vl_1 === 0 || data.vl_1 === '0') {
            data['vl_1'] = 'LD';
          }

        }
      }
      appointmentResult.push(data);
    }
    return appointmentResult;

  }

}
