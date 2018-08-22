import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import * as Moment from 'moment';
import { ClinicFlowResource } from '../../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
@Component({
    selector: 'clinic-flow-summary',
    templateUrl: './clinic-flow-summary.component.html'
})

export class ClinicFlowSummaryComponent implements OnInit, OnDestroy {
    public errors: any[] = [];
    public clinicFlowData: any[] = [];
    public hourlyStats: any[] = [];
    public loadingClinicFlow: boolean = false;
    public summarydataLoaded: boolean = false;
    public averageWaitingTime: any;
    public medianWaitingTime: any;
    public incompleteVisitsCount: any;
    public selectedLocation: any;
    public selectedDate: any;
    public dataLoaded: boolean = false;
    private clinicFlowSubscription: Subscription;
    private currentLocationSubscription: Subscription;
    private selectedDateSubscription: Subscription;

    constructor(private clinicFlowCacheService: ClinicFlowCacheService,
                private router: Router,
                @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource) { }

    public ngOnInit() {
        this.currentLocationSubscription = this.clinicFlowCacheService.getSelectedLocation()
            .subscribe((clinic) => {
                this.selectedLocation = clinic;
                this.selectedDateSubscription = this.clinicFlowCacheService.getSelectedDate()
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

    public ngOnDestroy(): void {
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
            throw new Error('Null clinic flow observable');
        } else {
            this.clinicFlowSubscription = result.subscribe(
                (data) => {
                    if (data && data.result.length > 0) {
                        let formatted = this.clinicFlowCacheService.formatData(
                            data.result);
                        this.hourlyStats = data.hourlyStats;
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

    public initParams() {
        this.loadingClinicFlow = false;
        this.dataLoaded = false;
        this.errors = [];
        this.clinicFlowData = [];
        this.incompleteVisitsCount = 0;
        this.hourlyStats = [];
    }

}
