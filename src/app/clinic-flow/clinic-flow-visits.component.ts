import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Router } from '@angular/router';
let _ = require('lodash');
@Component({
    selector: 'clinic-flow-visits',
    templateUrl: './clinic-flow-visits.component.html'
})

export class ClinicFlowVisitsComponent implements OnInit, OnDestroy {
    errors: any[] = [];
    clinicFlowData: any[] = [];
    loadingClinicFlow: boolean = false;
    dataLoaded: boolean = false;
    selectedLocation: any;
    selectedDate: any;
    filteredData: any;
    incompleteVisitsCount: any;
    completeVisitsCount: any;
    totalVisitsCount: any;
    selectedVisitType: any;
    visitCounts: any;
    encounters: any;

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
            patientUuid = event.node.data.patient_uuid;
        }

        if (patientUuid === undefined || patientUuid === null) {
            return;
        }

        this.router.navigate(['/patient-dashboard/patient/'
            + patientUuid + '/general/landing-page']);
    }

    columns() {
        return this.clinicFlowCacheService.getClinicFlowColumns();
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
                    this.incompleteVisitsCount = dataList.incompleteVisitsCount;
                    this.completeVisitsCount = dataList.completeVisitsCount;
                    this.totalVisitsCount = dataList.totalVisitsCount;
                    this.visitCounts = this.totalVisitsCount;
                    this.selectedVisitType = 'All Visits';


                    if (dataList.result.length > 0) {

                        this.encounters = this.AddEncounterSeenByClinician(dataList.result);
                        this.filteredData = this.clinicFlowCacheService.formatData(this.encounters);
                        let formatted = this.clinicFlowCacheService.formatData(this.encounters);
                        this.clinicFlowData = this.clinicFlowData.concat(formatted);
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
    incompletedVisits() {
        this.selectedVisitType = 'Incomplete Visits';
        this.visitCounts = this.incompleteVisitsCount + '/' + this.totalVisitsCount;
        let results = this.filteredData.filter(function (obj) {
            return obj.seen_by_clinician === null;
        });
        let orderedResults = this.renumberRowsOnFilter(results);

        this.clinicFlowData = orderedResults;

    }
    completedVisits() {
        this.selectedVisitType = 'Completed Visits';
        this.visitCounts = this.completeVisitsCount + '/' + this.totalVisitsCount;
        let results = this.filteredData.filter(function (obj) {
            return obj.seen_by_clinician !== null;
        });

        let orderedResults = this.renumberRowsOnFilter(results);

        this.clinicFlowData = orderedResults;

    }
    allVisits() {
        this.selectedVisitType = 'All Visits';
        this.visitCounts = this.totalVisitsCount;
        this.clinicFlowData = this.renumberRowsOnFilter(this.filteredData);
    }


    private initParams() {
        this.loadingClinicFlow = false;
        this.dataLoaded = false;
        this.errors = [];
        this.clinicFlowData = [];
        this.selectedVisitType = '';
        this.visitCounts = '';
    }
    private AddEncounterSeenByClinician(result) {
        let encounters = [];
        let encounter;
        for (let i = 0; i < result.length; ++i) {
            let data = result[i];
            for (let r in data) {
                if (data.hasOwnProperty(r)) {
                    for (let i = 0; i < data.encounters.length; ++i) {
                        let datas = data.encounters[i];
                        for (let r in datas) {
                            if (datas.hasOwnProperty(r)) {
                                encounter = datas.encounter_type_name;

                            }
                        }
                    }

                    let seenByClinician = { time: data.seen_by_clinician, encounters: encounter };
                    data['seenByClinician'] = seenByClinician;
                }
            }
            encounters.push(data);
        }
        return encounters;

    }

    private renumberRowsOnFilter(result) {
        let numbers = [];
        for (let i = 0; i < result.length; ++i) {
            let data = result[i];
            for (let r in data) {
                if (data.hasOwnProperty(r)) {
                    data['#'] = i + 1;
                }
            }
            numbers.push(data);
        }
        return numbers;

    }

}
