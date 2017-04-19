import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
import { ClinicFlowResource } from '../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Router } from '@angular/router';
let _ = require('lodash');
@Component({
    selector: 'clinic-flow-summary',
    templateUrl: './clinic-flow-summary.component.html'
})

export class ClinicFlowSummaryComponent implements OnInit, OnDestroy {
    errors: any[] = [];
    clinicFlowData: any[] = [];
    loadingClinicFlow: boolean = false;
    summarydataLoaded: boolean = false;
    averageWaitingTime: any;
    medianWaitingTime: any;
    incompleteVisitsCount: any;
    selectedLocation: any;
    selectedDate: any;
    dataLoaded: boolean = false;
    private clinicFlowSubscription: Subscription;
    private currentLocationSubscription: Subscription;
    private selectedDateSubscription: Subscription;

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
                        if (this.selectedLocation && this.selectedDate) {
                            if (this.loadingClinicFlow === false) {
                                this.initParams();
                                this.getClinicFlow(this.selectedDate, this.selectedLocation);
                            }
                        }

                    });

            });
    }

    ngOnDestroy(): void {
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
                (data) => {
                    if (data && data.result.length > 0) {
                        let formatted = this.clinicFlowCacheService.formatData(
                            data.result);
                        this.clinicFlowData = this.clinicFlowData.concat(formatted);
                        this.summarydataLoaded = true;
                        this.incompleteVisitsCount = data.incompleteVisitsCount;
                        this.averageWaitingTime = data.averageWaitingTime;
                        this.medianWaitingTime = data.medianWaitingTime;
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

    initParams() {
        this.loadingClinicFlow = false;
        this.dataLoaded = false;
        this.errors = [];
        this.clinicFlowData = [];
        this.incompleteVisitsCount = 0;
    }


}
