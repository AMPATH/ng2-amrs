
import { Component, OnInit, OnDestroy, Input, SimpleChange, ViewChild } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Router } from '@angular/router';
let _ = require('lodash');
import { AgGridNg2 } from 'ag-grid-angular';
@Component({
  selector: 'clinic-flow-provider-stats',
  templateUrl: './clinic-flow-provider-stats.component.html'
})

export class ClinicFlowProviderStatsComponent implements OnInit, OnDestroy {
  errors: any[] = [];
  clinicFlowData: any[] = [];
  loadingClinicFlow: boolean = false;
  dataLoaded: boolean = false;
  selectedLocation: any;
  selectedDate: any;
  providerEncounters: any = [];
  patientStatuses: any = [];
  finalProviderReport: any = [];
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  private currentLocationSubscription: Subscription;
  private selectedDateSubscription: Subscription;
  private clinicFlowSubscription: Subscription;

  constructor(private clinicFlowCacheService: ClinicFlowCacheService,
              private router: Router,
              @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource) { }

  ngOnInit() {
    this.currentLocationSubscription = this.clinicFlowCacheService.getSelectedLocation()
      .subscribe(clinic => {
        this.selectedLocation = clinic;
        this.selectedDateSubscription = this.clinicFlowCacheService.getSelectedDate()
          .subscribe(date => {
            this.selectedDate = date;

            if (this.selectedLocation && this.selectedDate
            ) {
              if (this.loadingClinicFlow === false) {
                this.initParams();
                this.getClinicFlow(this.selectedDate, this.selectedLocation);
              }

            }

          });

      });

  }

  loadSelectedPatient(event: any) {
    let patientUuid = '';
    if (event) {
      patientUuid = event.node.data.uuid;
    }

    if (patientUuid === undefined || patientUuid === null) {
      return;
    }

    this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/landing-page']);
  }

  setColumns(sectionsData: Array<any>) {
    let header = [];
    let defs = [];
    let uniqueKeys = Object.keys(sectionsData.reduce(function(result, obj) {
      return Object.assign(result, obj);
    }, {}));
    // move the #seen column to be at index 2
    uniqueKeys.splice(uniqueKeys.indexOf('#_Seen'), 1 );
    uniqueKeys.splice(2, 0, '#_Seen');
    for (let i = 0; i < uniqueKeys.length ; ++i) {
      header.push({label: uniqueKeys[i]});
    }
    if (header) {
      defs.push({
        headerName: 'Person Name',
        field: 'Person_Name',
        pinned: 'left'
      });
      let personName = 'Person_Name';
      header = header.filter(function(el){ return el.label !== personName; });
      _.each(  header, (keys) => {
        defs.push({
          headerName: this.titleCase(keys.label),
          field: keys.label,
        });
      });
      this.gridOptions.columnDefs = defs;
    }

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }

  titleCase(str) {
    return str.toLowerCase().split('_').map((word) => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  ngOnDestroy(): void {
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
    let result = this.clinicFlowResource.
    getClinicFlow(dateStated, locations);
    if (result === null) {
      throw 'Null clinic flow observable';
    } else {

      this.clinicFlowSubscription = result.subscribe(
        (dataList) => {
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
        }
        ,
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
  transformVisitsToDummyEncounters(result) {
    _.each(result, (data) => {
      // reconstructing an array of objects to contain all provider encounters
      this.providerEncounters.push.apply(this.providerEncounters, data.encounters);

      /* adding a dummy encounter type to be used to keep track of visits started and the
       details of the person who started the visit
       */
      this.providerEncounters.unshift(
        {
          person_name: data.visit_person_Name,
          location: data.location,
          encounter_type: 8888,
          person_id: data.visit_person_id,

          encounter_type_name: 'Visits_Started'

        });

    });

  }
  groupEncountersByProvider() {
    let providersPersonIds = [ ];
    let uniqueProviderPersonIds = {};
    for ( let i in this.providerEncounters ) {
      if (this.providerEncounters.hasOwnProperty(i)) {
        if (typeof(uniqueProviderPersonIds[this.providerEncounters[i].person_id]) === 'undefined') {
          providersPersonIds.push(this.providerEncounters[i].person_id);

        }
        uniqueProviderPersonIds[this.providerEncounters[i].person_id] = 0;
      }
    }
    this._constructFinalProviderReport(providersPersonIds);
  }
  getTotalPatientSeenByProvider(arrayOfObjects, visits) {

    let result = [];

    for (let i = 0; i < arrayOfObjects.length ; ++i) {
      let data = arrayOfObjects[i];
      let sum = 0;
      for (let x in data) {
        if (x !== visits) {

          let value = data[x];

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
      let row = {};
      _.each(this.providerEncounters, (result) => {

        if (provider === result.person_id) {
          row['Person_Name'] = result.person_name;
          row['Location'] = result.location;
          // count encounter type per provider
          row[result.encounter_type_name] = (row[result.encounter_type_name] || 0) + 1;


        }

      });

      this.finalProviderReport.push(row);
    });

    this.finalProviderReport =
      this.getTotalPatientSeenByProvider(this.finalProviderReport, 'Visits_Started');
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

}
