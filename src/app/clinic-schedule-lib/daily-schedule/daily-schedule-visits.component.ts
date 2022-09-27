import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Subscription } from 'rxjs';
import * as Moment from 'moment';

import { ClinicDashboardCacheService } from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { DailyScheduleResourceService } from '../../etl-api/daily-scheduled-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

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
  public dataLoaded = false;
  public currentTabLoaded = false;
  public selectedVisitTab: any;
  public nextStartIndex = 0;
  public extraColumns: Array<any> = [
    {
      headerName: 'Program',
      width: 200,
      field: 'program'
    },
    {
      headerName: 'ART start date',
      width: 120,
      field: 'arv_first_regimen_start_date'
    },
    {
      headerName: 'Covid-19 Assessment Status',
      width: 250,
      field: 'covid_19_vaccination_status'
    },
    {
      headerName: 'TB Screening Date',
      width: 150,
      field: 'tb_screening_date'
    },
    {
      headerName: 'TB Screening Result',
      width: 200,
      field: 'tb_screening_result'
    },
    {
      headerName: 'SMS Consent Provided',
      width: 150,
      field: 'sms_consent_provided'
    },
    {
      headerName: 'SMS Time',
      width: 100,
      field: 'sms_receive_time'
    }
  ];
  public filter: any = {
    programType: [],
    visitType: [],
    encounterType: []
  };
  public params: any = {
    programType: [],
    visitType: [],
    encounterType: []
  };
  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public fetchCount = 0;
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
  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private dailyScheduleResource: DailyScheduleResourceService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.selectedDate = Moment().format('YYYY-MM-DD');
    const sub = this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
        if (this.clinicDashboardCacheService.didLocationChange(location)) {
          this.loadData();
        }
      });
    this.subs.push(sub);

    this.loadData();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public loadData() {
    const routeSub = this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.programType || params.department) {
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
    let department = '';
    if (this.params.department && this.params.department.length > 0) {
      department = this.params.department;
    }
    if (this.params.programType && this.params.programType.length > 0) {
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
      department: department,
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
    const result = this.dailyScheduleResource.getDailyVisits(params);

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
          this.clinicDashboardCacheService.setIsLoading(
            this.loadingDailyVisits
          );
        },
        (error) => {
          this.setFree();
          this.loadingDailyVisits = false;
          this.clinicDashboardCacheService.setIsLoading(
            this.loadingDailyVisits
          );
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
