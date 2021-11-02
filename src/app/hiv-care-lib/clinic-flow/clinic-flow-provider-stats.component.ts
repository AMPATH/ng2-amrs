import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { ClinicFlowResource } from '../../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';
@Component({
  selector: 'clinic-flow-provider-stats',
  templateUrl: './clinic-flow-provider-stats.component.html'
})
export class ClinicFlowProviderStatsComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  public clinicFlowData: any[] = [];
  public gridOptions: any = {
    columnDefs: []
  };
  private loadingClinicFlow = false;
  private dataLoaded = false;
  private selectedLocation: any;
  private selectedDate: any;
  private providerEncounters: any = [];
  private patientStatuses: any = [];
  private finalProviderReport: any = [];
  @ViewChild('agGrid')
  private agGrid: AgGridNg2;
  private currentLocationSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  private clinicFlowSubscription: Subscription;

  constructor(
    private clinicFlowCacheService: ClinicFlowCacheService,
    private router: Router,
    public route: ActivatedRoute,
    @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource
  ) {}

  public ngOnInit() {
    this.currentLocationSubscription = this.clinicFlowCacheService
      .getSelectedLocation()
      .subscribe((clinic) => {
        this.selectedLocation = clinic;
        this.selectedDateSubscription = this.clinicFlowCacheService
          .getSelectedDate()
          .subscribe((date) => {
            this.selectedDate = date;

            if (this.selectedLocation && this.selectedDate) {
              if (this.loadingClinicFlow === false) {
                this.initParams();
                this.getClinicFlow(this.selectedDate, this.selectedLocation);
              }
            }
          });
      });
  }

  public loadSelectedPatient(event: any) {
    let patientUuid = '';
    if (event) {
      patientUuid = event.node.data.uuid;
    }

    if (patientUuid === undefined || patientUuid === null) {
      return;
    }

    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/landing-page'
    ]);
  }

  public setColumns(sectionsData: Array<any>) {
    let header = [];
    const defs = [];
    const uniqueKeys = Object.keys(
      sectionsData.reduce((result, obj) => {
        return Object.assign(result, obj);
      }, {})
    );
    // move the #seen column to be at index 2
    uniqueKeys.splice(uniqueKeys.indexOf('#_Seen'), 1);
    uniqueKeys.splice(2, 0, '#_Seen');
    for (const i of uniqueKeys) {
      header.push({ label: i });
    }
    if (header) {
      defs.push({
        headerName: 'Person Name',
        field: 'Person_Name',
        pinned: 'left'
      });
      const personName = 'Person_Name';
      header = header.filter((el) => {
        return el.label !== personName;
      });
      _.each(header, (keys: any) => {
        defs.push({
          headerName: this.titleCase(keys.label),
          field: keys.label,
          hide:
            keys.label === 'provider_uuid' ||
            keys.label === 'provider_ecounters' ||
            keys.label === 'visit_date' ||
            keys.label === 'location_uuid'
              ? true
              : false
        });
      });
      this.gridOptions.columnDefs = defs;
      this.gridOptions.enableColResize = true;
    }

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }

  public titleCase(str) {
    return str
      .toLowerCase()
      .split('_')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  public ngOnDestroy(): void {
    if (this.currentLocationSubscription) {
      this.currentLocationSubscription.unsubscribe();
    }

    if (this.selectedDateSubscription) {
      this.selectedDateSubscription.unsubscribe();
    }

    if (this.clinicFlowSubscription) {
      this.clinicFlowSubscription.unsubscribe();
    }
  }

  public getClinicFlow(dateStated, locations) {
    this.initParams();
    this.loadingClinicFlow = true;
    this.clinicFlowCacheService.setIsLoading(this.loadingClinicFlow);
    const result = this.clinicFlowResource.getClinicFlow(dateStated, locations);
    if (result === null) {
      throw new Error('Null clinic flow observable');
    } else {
      this.clinicFlowSubscription = result.take(1).subscribe(
        (dataList: any) => {
          this.patientStatuses = dataList.result;
          this.transformVisitsToDummyEncounters(this.patientStatuses);
          this.groupEncountersByProvider();
          if (this.patientStatuses.length > 0) {
            this.clinicFlowData = this.finalProviderReport;
            this.setColumns(this.finalProviderReport);
          } else {
            this.dataLoaded = true;
          }
          this.loadingClinicFlow = false;
          this.clinicFlowCacheService.setIsLoading(this.loadingClinicFlow);
        },
        (error) => {
          this.loadingClinicFlow = false;
          this.clinicFlowCacheService.setIsLoading(this.loadingClinicFlow);
          this.errors.push({
            id: 'Clinic Flow',
            message: 'error fetching clinic flow data'
          });
        }
      );
    }
  }
  public transformVisitsToDummyEncounters(result: any) {
    _.each(result, (data: any) => {
      // reconstructing an array of objects to contain all provider encounters
      this.providerEncounters.push.apply(
        this.providerEncounters,
        data.encounters
      );

      /* adding a dummy encounter type to be used to keep track of visits started and the
       details of the person who started the visit
       */
      this.providerEncounters.unshift({
        person_name: data.visit_person_Name,
        location: data.location,
        encounter_type: 8888,
        person_id: data.visit_person_id,
        encounter_type_name: 'Visits_Started'
      });
    });
  }
  public groupEncountersByProvider() {
    const providersPersonIds = [];
    const uniqueProviderPersonIds = {};
    for (const i in this.providerEncounters) {
      if (this.providerEncounters.hasOwnProperty(i)) {
        if (
          typeof uniqueProviderPersonIds[
            this.providerEncounters[i].person_id
          ] === 'undefined'
        ) {
          providersPersonIds.push(this.providerEncounters[i].person_id);
        }
        uniqueProviderPersonIds[this.providerEncounters[i].person_id] = 0;
      }
    }
    this._constructFinalProviderReport(providersPersonIds);
  }
  public getTotalPatientSeenByProvider(arrayOfObjects: any, visits: string) {
    const result = [];

    for (const i of arrayOfObjects) {
      const data = i;
      let sum = 0;
      for (const x in data) {
        if (x !== visits) {
          const value = data[x];

          if (typeof value === 'number') {
            sum += value;
          }
        }
      }
      data['#_Seen'] = sum;
      result.push(data);
    }
    return result;
  }
  private _constructFinalProviderReport(providersPersonIds) {
    _.each(providersPersonIds, (provider) => {
      const row = {
        provider_ecounters: []
      };
      _.each(this.providerEncounters, (result: any) => {
        if (provider === result.person_id) {
          row['Person_Name'] = result.person_name;
          row['Location'] = result.location;
          row['provider_uuid'] = result.provider_uuid;
          row['visit_date'] = moment(result.encounter_start).format(
            'YYYY-MM-DD'
          );
          row['location_uuid'] = result.encounter_location;
          row['provider_ecounters'].push({
            encounter_type: result.encounter_type_name,
            encounter_type_id: result.encounter_type,
            encounter_date: moment(result.encounter_start).format('YYYY-MM-DD'),
            encounter_location: result.encounter_location
          });
          // count encounter type per provider
          row[result.encounter_type_name] =
            (row[result.encounter_type_name] || 0) + 1;
        }
      });

      this.finalProviderReport.push(row);
    });

    this.finalProviderReport = this.getTotalPatientSeenByProvider(
      this.finalProviderReport,
      'Visits_Started'
    );
  }

  private initParams() {
    this.loadingClinicFlow = false;
    this.dataLoaded = false;
    this.errors = [];
    this.clinicFlowData = [];
    this.finalProviderReport = [];
    this.gridOptions.columnDefs = [];
    this.patientStatuses = [];
    this.providerEncounters = [];
  }

  public onCellClicked($event: any): void {
    const params = this.generatePatientListParams($event);
    this.navigateToPatientList(params);
  }
  private generatePatientListParams(colData: any) {
    const field: string = colData.colDef.field;
    const indicator = this.getIndicator(field);
    let encounter = {
      encounter_type_id: '',
      encounter_date: colData.data.visit_date,
      encounter_location: colData.data.location_uuid
    };
    const providerEncounters = colData.data.provider_ecounters;
    const hasNonPatientListIndicators = [
      'Location',
      'Person_Name',
      '#_Seen',
      'Visits_Started',
      'Location_Uuid'
    ].some((e: string) => e === field);
    if (!hasNonPatientListIndicators) {
      encounter = providerEncounters.find((enc: any) => {
        return enc.encounter_type === field && enc.encounter_type_id !== 8888;
      });
    }
    const params = {
      providerUuid: colData.data.provider_uuid,
      encounterTypeId: encounter.encounter_type_id,
      encounterDate: encounter.encounter_date,
      indicators: indicator,
      location_uuid: encounter.encounter_location
    };

    return params;
  }
  public navigateToPatientList(params: any) {
    if (params.encounterTypeId.length === 0 && params.indicators.length === 0) {
      return false;
    }
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: params
    });
  }
  public getIndicator(field: string): string {
    let indicator = '';
    switch (field) {
      case '#_Seen':
        indicator = 'seen';
        break;
      case 'Visits_Started':
        indicator = 'visit_started';
        break;
      default:
        indicator = '';
    }

    return indicator;
  }
}
