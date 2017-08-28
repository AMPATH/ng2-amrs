import { Component, OnInit, OnDestroy, Input, SimpleChange, EventEmitter } from '@angular/core';
import { Injectable, Inject } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as Moment from 'moment';
import { ClinicFlowResource } from '../../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
@Component({
    selector: 'clinic-flow-visits',
    templateUrl: './clinic-flow-visits.component.html'
})

export class ClinicFlowVisitsComponent implements OnInit, OnDestroy {
    public filterCollapsed: boolean;
    public errors: any[] = [];
    public clinicFlowData: any[] = [];
    public incompleteVisitsCount: any;
    public completeVisitsCount: any;
    public totalVisitsCount: any;
    public selectedVisitType: any;
    public visitCounts: any;
    private encounters: any;
    private filteredData: any;
    private selectedLocation: any;
    private selectedDate: any;
    private loadingClinicFlow: boolean = false;
    private dataLoaded: boolean = false;
    private currentLocationSubscription: Subscription;
    private selectedDateSubscription: Subscription;
    private clinicFlowSubscription: Subscription;

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

    public loadSelectedPatient(event: any) {
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

    public columns() {
        return this.clinicFlowCacheService.getClinicFlowColumns();
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
        let result = this.clinicFlowResource.
            getClinicFlow(dateStated, locations);
        if (result === null) {
            throw new Error('Null clinic flow observable');
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
    public incompletedVisits() {
        this.selectedVisitType = 'Incomplete Visits';
        this.visitCounts = this.incompleteVisitsCount + '/' + this.totalVisitsCount;
        let results = this.filteredData.filter((obj) => {
            return obj.seen_by_clinician === null;
        });
        let orderedResults = this.renumberRowsOnFilter(results);

        this.clinicFlowData = orderedResults;

    }
    public completedVisits() {
        this.selectedVisitType = 'Completed Visits';
        this.visitCounts = this.completeVisitsCount + '/' + this.totalVisitsCount;
        let results = this.filteredData.filter((obj) => {
            return obj.seen_by_clinician !== null;
        });

        let orderedResults = this.renumberRowsOnFilter(results);

        this.clinicFlowData = orderedResults;

    }
    public allVisits() {
        this.selectedVisitType = 'All Visits';
        this.visitCounts = this.totalVisitsCount;
        this.clinicFlowData = this.renumberRowsOnFilter(this.filteredData);
    }

    private getTriageLocation(obj) {
            let result = obj.encounters.filter((encounter) => {
                return encounter.encounter_type_name === 'HIVTRIAGE';
            });
            return result.length > 0 ? result[0].location : null;
    }

    private getClinicianLocation(obj) {
        let encounterType = this.getClinicianEncounterTypeLocation(obj);
        let encounters = obj.encounters;
        let result = encounters.filter((encounter) => {
                    return encounter.encounter_type_name === encounterType;
                });
        return result.length > 0 ? result[0].location : null;
    }

    private getClinicianEncounterTypeLocation(obj) {
        return obj.seenByClinician.encounters;
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
        for (let i of result) {
            let data = i;
            for (let r in data) {
                if (data.hasOwnProperty(r)) {
                    for (let j of data.encounters) {
                        let datas = j;
                        for (let k in datas) {
                            if (datas.hasOwnProperty(k)) {
                                encounter = datas.encounter_type_name;
                            }
                        }
                    }

                    let seenByClinician = { time: data.seen_by_clinician, encounters: encounter };
                    data['seenByClinician'] = seenByClinician;
                    if (data.seen_by_clinician) {
                                    let triageLoc = this.getTriageLocation(data);
                                    let clinicianLoc = this.getClinicianLocation(data);
                                    if (triageLoc && clinicianLoc !== triageLoc) {
                                      data['location'] = '-';
                                    }
                    }
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
