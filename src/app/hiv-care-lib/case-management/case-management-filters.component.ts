import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CaseManagementResourceService } from './../../etl-api/case-management-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';


@Component({
    selector: 'case-management-filters',
    templateUrl: './case-management-filters.component.html',
    styleUrls: ['./case-management-filters.component.css']
})

export class CaseManagementFiltersComponent implements OnInit, OnChanges {

    public title = 'Case Management Report Filters';
    public params = {
        'caseManagerUuid': '',
        'hasCaseManager': '',
        'hasPhoneRTC': '',
        'dueForVl': '',
        'elevatedVL': '',
        'minDefaultPeriod': 0,
        'maxDefaultPeriod': 0,
        'minFollowupPeriod': 0,
        'maxFollowupPeriod': 0,
        'rtcStartDate': '',
        'rtcEndDate': '',
        'phoneFollowUpStartDate': '',
        'filterSet': false,
        'locationUuid': ''
    };

    public showFilters = true;

    public locationParams = {};

    @Input() public clinicDashboardLocation: any;

    public caseManagers = [];
    public selectedCaseManager: any;
    public mockCaseManagers = [
        {
            label: ' Manager 1',
            value: 1
        },
        {
            label: ' Manager 2',
            value: 2
        },
        {
            label: ' Manager 3',
            value: 3
        }
    ];

    public dueForVl = '';
    public elevatedVL = '';
    public hasCaseManager = '';
    public hasPhoneRTC = '';
    public minFollowupPeriod = 0;
    public maxFollowupPeriod = 0;
    public minDefaultPeriod = 0;
    public maxDefaultPeriod = 0;
    public hideCaseManagerControl = false;
    public filterSet = false;
    public selecOptions = [
        {
            'label': 'All',
            'value': ''
        },
        {
            'label': 'Yes',
            'value': 'true'
        },
        {
            'label': 'No',
            'value': 'false'
        }
    ];

    public rtcStartDate = Moment().format('YYYY-MM-DD');
    public rtcEndDate = Moment().format('YYYY-MM-DD');
    public phoneFollowUpStartDate = Moment().format('YYYY-MM-DD');
    public selectedRtcStartDate = '';
    public selectedRtcEndDate = '';
    public selectedPhoneFollowUpDate = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private caseManagementResourceService: CaseManagementResourceService) {
    }

    public ngOnInit() {
        this.getCaseManagers();
        this.getParamsFromUrl();
    }

    public ngOnChanges(change: SimpleChanges) {

        if (change.clinicDashboardLocation
            && typeof change.clinicDashboardLocation.previousValue !== 'undefined') {
            this.getCaseManagers();
            this.selectedCaseManager = '';
            this.setParams();
        }

    }


    public getCaseManagers() {
        const locationParams = this.getLocationParams();
        this.caseManagementResourceService.getCaseManagers(locationParams)
            .subscribe((result: any) => {
                this.processCaseManagers(result.result);
            });

    }

    public getLocationParams() {
        return {
            'locationUuid': this.clinicDashboardLocation
        };
    }

    public processCaseManagers(caseManagers) {

        const managers = [];
        _.each(caseManagers, (manager: any) => {
            managers.push(
                {
                    label: manager.person_name,
                    value: manager.user_uuid
                }
            );
        });

        this.caseManagers = managers;

    }

    public setFilters() {
        console.log('set filters..');
        this.filterSet = true;
        this.setParams();
    }
    public setParams() {
        this.params = {
            'caseManagerUuid': this.selectedCaseManager,
            'dueForVl': this.dueForVl,
            'elevatedVL': this.elevatedVL,
            'hasCaseManager': this.hasCaseManager,
            'hasPhoneRTC': this.hasPhoneRTC,
            'minDefaultPeriod': this.minDefaultPeriod,
            'maxDefaultPeriod': this.maxDefaultPeriod,
            'maxFollowupPeriod': this.maxDefaultPeriod,
            'minFollowupPeriod': this.minFollowupPeriod,
            'rtcStartDate': this.selectedRtcStartDate,
            'rtcEndDate': this.selectedRtcEndDate,
            'phoneFollowUpStartDate': this.selectedPhoneFollowUpDate,
            'filterSet': this.filterSet,
            'locationUuid': this.clinicDashboardLocation
        };

        this.storeReportParamsInUrl(this.params);

    }


    public storeReportParamsInUrl(params) {

        this.router.navigate(['./'],
            {
                queryParams: params,
                relativeTo: this.route
            });

    }

    public getParamsFromUrl() {
        const urlParams: any = this.route.snapshot.queryParams;
        // only use filter data if filter had been set else use defaults
        if (urlParams.filterSet) {
            this.dueForVl = urlParams.dueForVl;
            this.hasCaseManager = urlParams.hasCaseManager;
            this.toggleCaseManagerControl(urlParams.hasCaseManager);
            this.hasPhoneRTC = urlParams.hasPhoneRTC;
            this.elevatedVL = urlParams.elevatedVL;
            this.minFollowupPeriod = urlParams.minFollowupPeriod ? urlParams.minFollowupPeriod : '';
            this.maxFollowupPeriod = urlParams.maxFollowupPeriod ? urlParams.maxFollowupPeriod : '';
            this.minDefaultPeriod = urlParams.minDefaultPeriod ? urlParams.minDefaultPeriod : '';
            this.maxDefaultPeriod = urlParams.maxDefaultPeriod ? urlParams.maxDefaultPeriod : '';
            this.selectedCaseManager = urlParams.caseManagerUuid ? urlParams.caseManagerUuid : '';
            this.rtcStartDate = urlParams.rtcStartDate ? urlParams.rtcStartDate : '';
            this.selectedRtcStartDate = this.rtcStartDate;
            this.rtcEndDate = urlParams.rtcEndDate ? urlParams.rtcEndDate : '';
            this.selectedRtcEndDate = this.rtcEndDate;
            this.phoneFollowUpStartDate = urlParams.phoneFollowUpStartDate ? urlParams.phoneFollowUpStartDate : '';
            this.selectedPhoneFollowUpDate = this.phoneFollowUpStartDate;
        }

    }

    public onDueForVlChange($event) {
        this.dueForVl = $event;
    }
    public onElevatedVLChange($event) {
        this.elevatedVL = $event;

    }
    public onHasCaseManagerChange($event) {
        this.hasCaseManager = $event;
        this.toggleCaseManagerControl($event);
    }
    public toggleCaseManagerControl(hasCaseManager) {

        switch (hasCaseManager) {
            case 'true':
                this.hideCaseManagerControl = false;
                break;
            case 'false':
                this.hideCaseManagerControl = true;
                break;
            default:
                this.hideCaseManagerControl = false;
        }
        this.selectedCaseManager = '';
    }
    public onHasPhoneRTCChange($event) {
        this.hasPhoneRTC = $event;
    }
    public toggleFiltersVisibility() {
        this.showFilters = !this.showFilters;
    }
    public getSelectedRtcStartDate($event) {
        this.selectedRtcStartDate = Moment($event).format('YYYY-MM-DD');
    }

    public getSelectedRtcEndDate($event) {
        this.selectedRtcEndDate = Moment($event).format('YYYY-MM-DD');
    }
    public getSelectedPhoneFollowUpStartDate($event) {
        this.selectedPhoneFollowUpDate = Moment($event).format('YYYY-MM-DD');
    }




}

