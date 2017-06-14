import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
  DefaulterListResourceService
} from
  '../../etl-api/defaulter-list-resource.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.css']
})
export class DefaulterListComponent implements OnInit {

  minDefaultPeriod: any;
  maxDefaultPeriod: any;
  errors: any[] = [];
  defaulterList: any[] = [];
  loadingDefaulterList: boolean = false;
  dataLoaded: boolean = false;
  selectedClinic: any;
  nextStartIndex: number = 0;
  private _datePipe: DatePipe;
  private subscription: Subscription = new Subscription();

  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private defaulterListResource: DefaulterListResourceService) {
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
      }
    ];
  }

  public loadDefaulterList() {
    this.initParams();
    let params = this.getQueryParams(this.minDefaultPeriod,
      this.maxDefaultPeriod, this.selectedClinic);

    if (this.selectedClinic) {
      this.getDefaulterList(params);
    }
  }

  ngOnInit() {
    let cachedParams = this.getCachedDefaulterListParam('defaulterListParam');
    if (cachedParams) {
      this.loadDefaulterListFromCachedParams(cachedParams);
    }
    this.subscribeToLocationChangeEvent();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadMoreDefaulterList() {
    this.loadingDefaulterList = true;
    let params = this.getQueryParams(this.minDefaultPeriod,
      this.maxDefaultPeriod, this.selectedClinic);
    this.loadDefaulterListFromCachedParams(params);
  }

  private loadDefaulterListFromCachedParams(cachedParams) {
    this.minDefaultPeriod = cachedParams.defaulterPeriod;
    this.maxDefaultPeriod = cachedParams.maxDefaultPeriod;
    this.getDefaulterList(cachedParams);
  }

  private subscribeToLocationChangeEvent() {
    this.subscription = this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
      this.selectedClinic = location;
      if (this.minDefaultPeriod) {
        this.loadDefaulterList();
      }
    });
  }

  private getDatePart(datetime: string) {
    if (datetime && datetime.length > 10) {
      return datetime.substring(0, 10);
    }
    return datetime;
  }

  private formatDefaulterListData(data) {

    let formatedData = data.map((dataItem) => {
      let formatedEncDate = this._datePipe.transform(
        this.getDatePart(dataItem.encounter_datetime), 'dd-MM-yyyy');

      let formatedRTCDate = this._datePipe.transform(this.getDatePart(dataItem.rtc_date),
        'dd-MM-yyyy');
      return {
        uuid: dataItem.patient_uuid,
        rtc_date: formatedRTCDate + ' (' + dataItem.days_since_rtc
        + ' days ago)',
        days_since_rtc: dataItem.days_since_rtc,
        identifiers: dataItem.identifiers,
        filed_id: dataItem.filed_id,
        gender: dataItem.gender,
        age: dataItem.age,
        person_name: dataItem.person_name,
        encounter_type_name: dataItem.encounter_type_name,
        last_appointment: formatedEncDate + ' ' + dataItem.encounter_type_name,
        encounter_datetime: formatedEncDate
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

  private getQueryParams(defaulterPeriod, maxDefaultPeriod, selectedLocation) {
    let params = {
      maxDefaultPeriod: maxDefaultPeriod,
      defaulterPeriod: defaulterPeriod,
      startIndex: this.nextStartIndex,
      locationUuids: selectedLocation,
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
    let result = this.defaulterListResource.getDefaulterList(params);

    if (result === null) {
      throw 'Null Defaulter List observable';
    } else {
      result.subscribe(
        (patientList) => {
          if (patientList.length > 0) {
            this.defaulterList = this.defaulterList.concat(
              this.formatDefaulterListData(patientList));
            let size: number = patientList.length;
            this.nextStartIndex = this.nextStartIndex + size;
          } else {
            this.dataLoaded = true;
          }
          this.loadingDefaulterList = false;
        }
        ,
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
