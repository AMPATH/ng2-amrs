import { take } from 'rxjs/operators';
import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaulterListResourceService } from '../../../etl-api/defaulter-list-resource.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.css']
})
export class DefaulterListComponent implements OnInit, OnDestroy {
  public minDefaultPeriod: any;
  public maxDefaultPeriod: any;
  public errors: any[] = [];
  public defaulterList: any[] = [];
  public loadingDefaulterList = false;
  public dataLoaded = false;
  public selectedClinic: any;
  public nextStartIndex = 0;
  private _datePipe: DatePipe;
  public params: any;
  private subs: Subscription[] = [];
  public events = [];
  public programUuid: any;
  public defaultersControl = true;

  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private defaulterListResource: DefaulterListResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._datePipe = new DatePipe('en-US');
  }

  public extraColumns() {
    return [
      {
        headerName: 'Rtc Date',
        field: 'rtc_date',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Last Appointment',
        field: 'last_appointment',
        width: 160,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Filing Id',
        field: 'filed_id',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Phone Number',
        field: 'phone_number',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Latest Appointment',
        width: 200,
        field: 'latest_appointment'
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date'
      },
      {
        headerName: 'Current Regimen',
        width: 200,
        field: 'cur_meds'
      },
      {
        headerName: 'Latest VL',
        width: 75,
        field: 'latest_vl'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'latest_vl_date'
      },
      {
        headerName: 'Previous VL',
        width: 75,
        field: 'previous_vl'
      },
      {
        headerName: 'Previous VL Date',
        width: 150,
        field: 'previous_vl_date'
      },
      {
        headerName: 'Nearest Center',
        width: 150,
        field: 'nearest_center'
      }
    ];
  }

  public filterSelected($event: any) {
    this.params = $event;
    if ($event.resetFilter && $event.resetFilter === true) {
      this.events = [];
    } else {
      this.minDefaultPeriod = this.params.minDefaultPeriod;
      this.maxDefaultPeriod = this.params.maxDefaultPeriod;
      if (this.params.programType.length > 0) {
        this.programUuid = this.params.programType[0];
      }
      this.loadDefaulterList();
    }
  }

  public loadDefaulterList() {
    this.initParams();
    const params = this.getQueryParams(
      this.minDefaultPeriod,
      this.maxDefaultPeriod,
      this.selectedClinic,
      this.programUuid
    );

    if (this.selectedClinic) {
      this.getDefaulterList(params);
    }
  }

  public ngOnInit() {
    this.getLocation();
    const cachedParams = this.getCachedDefaulterListParam('defaulterListParam');
    if (cachedParams) {
      this.loadDefaulterListFromCachedParams(cachedParams);
    }
    this.subscribeToLocationChangeEvent();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public loadMoreDefaulterList() {
    this.loadingDefaulterList = true;
    const params = this.getQueryParams(
      this.minDefaultPeriod,
      this.maxDefaultPeriod,
      this.selectedClinic,
      this.programUuid
    );
    this.loadDefaulterListFromCachedParams(params);
  }

  private getLocation() {
    const routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });

    this.subs.push(routeSub);
  }

  private loadDefaulterListFromCachedParams(cachedParams) {
    this.minDefaultPeriod = cachedParams.defaulterPeriod;
    this.maxDefaultPeriod = cachedParams.maxDefaultPeriod;
    this.getDefaulterList(cachedParams);
  }

  private subscribeToLocationChangeEvent() {
    const sub = this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
        if (this.minDefaultPeriod) {
          this.loadDefaulterList();
        }
      });

    this.subs.push(sub);
  }

  private getDatePart(datetime: string) {
    if (datetime && datetime.length > 10) {
      return datetime.substring(0, 10);
    }
    return datetime;
  }

  private formatDefaulterListData(data) {
    const formatedData = data.map((dataItem) => {
      const formatedEncDate = this._datePipe.transform(
        this.getDatePart(dataItem.encounter_datetime),
        'dd-MM-yyyy'
      );

      const formatedRTCDate = this._datePipe.transform(
        this.getDatePart(dataItem.rtc_date),
        'dd-MM-yyyy'
      );
      return {
        uuid: dataItem.patient_uuid,
        rtc_date:
          formatedRTCDate + ' (' + dataItem.days_since_rtc + ' days ago)',
        days_since_rtc: dataItem.days_since_rtc,
        identifiers: dataItem.identifiers,
        filed_id: dataItem.filed_id,
        gender: dataItem.gender,
        age: dataItem.age,
        person_name: dataItem.person_name,
        encounter_type_name: dataItem.encounter_type_name,
        last_appointment: formatedEncDate + ' ' + dataItem.encounter_type_name,
        encounter_datetime: formatedEncDate,
        phone_number: dataItem.phone_number,
        latest_appointment: dataItem.last_appointment,
        latest_rtc_date: dataItem.latest_rtc_date,
        cur_meds: dataItem.cur_meds,
        latest_vl: dataItem.latest_vl,
        latest_vl_date: dataItem.latest_vl_date,
        previous_vl: dataItem.previous_vl,
        previous_vl_date: dataItem.previous_vl_date,
        nearest_center: dataItem.nearest_center
      };
    });
    return formatedData;
  }

  private initParams() {
    this.loadingDefaulterList = true;
    this.dataLoaded = false;
    this.errors = [];
    this.defaulterList = [];
    this.nextStartIndex = 0;
  }

  private getQueryParams(
    defaulterPeriod,
    maxDefaultPeriod,
    selectedLocation,
    programUuid
  ) {
    const params = {
      maxDefaultPeriod: maxDefaultPeriod,
      defaulterPeriod: defaulterPeriod,
      startIndex: this.nextStartIndex,
      locationUuids: selectedLocation,
      programUuid: programUuid,
      limit: undefined
    };
    this.cacheDefaulterListParam(params);
    return params;
  }

  private cacheDefaulterListParam(params) {
    this.clinicDashboardCacheService.add('defaulterListParam', params);
  }

  private getCachedDefaulterListParam(key) {
    return this.clinicDashboardCacheService.getByKey(key);
  }

  private getDefaulterList(params) {
    this.loadingDefaulterList = true;
    const result = this.defaulterListResource.getDefaulterList(params);

    if (result === null) {
      throw new Error('Null Defaulter List observable');
    } else {
      result.pipe(take(1)).subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            this.defaulterList = this.defaulterList.concat(
              this.formatDefaulterListData(patientList)
            );
            const size: number = patientList.length;
            this.nextStartIndex = this.nextStartIndex + size;
          } else {
            this.dataLoaded = true;
          }
          this.loadingDefaulterList = false;
        },
        (error) => {
          this.loadingDefaulterList = false;
          this.errors.push({
            id: 'Defaulter List',
            message: 'error fetching a list of defaulters'
          });
        }
      );
    }
  }
}
