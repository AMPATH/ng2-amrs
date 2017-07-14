import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
    HivSummaryIndicatorsResourceService
} from '../../etl-api/hiv-summary-indicators-resource.service';
import { Location } from '@angular/common';


@Component({
    selector: 'hiv-summary-patient-list',
    templateUrl: 'patient-list.component.html'
})
export class HivSummaryIndicatorsPatientListComponent implements OnInit {
    routeParamsSubscription: Subscription;
    indicator: string;
    translatedIndicator: string;
    patientData: any;
    startDate: any;
    endDate: any;
    startAge: any;
    endAge: any;
    gender: any;
    locationUuids: Array<string>;
    startIndex: number = 0;
    isLoading: boolean = false;
    dataLoaded: boolean = false;
    overrideColumns: Array<any> = [];

    constructor(public route: ActivatedRoute,
        public router: Router,
        public resourceService: HivSummaryIndicatorsResourceService,
        private _location: Location) {
    }

    ngOnInit() {
        this.routeParamsSubscription = this.route.params.subscribe((params) => {
            if (params) {
                let period = params['period'].split('|');
                this.getDateRange(period);
                this.indicator = params['indicator'];
                this.translatedIndicator = this.translateIndicator(this.indicator);
                let age = params['age'].split('|');
                this.getAgeRange(age);
                this.gender = params['gender'];
                this.overrideColumns.push({
                    field: 'identifiers',
                    onCellClicked: (column) => {
                        this.redirectTopatientInfo(column.data.patient_uuid);
                    },
                    cellRenderer: (column) => {
                        return '<a href="javascript:void(0);" title="Identifiers">'
                            + column.value + '</a>';
                    }
                });
            }
        });

        this.route.parent.parent.parent.params.subscribe((params: any) => {
            this.locationUuids = [];
            if (params.location_uuid)
                this.locationUuids.push(params.location_uuid);
        });

        this.generatePatientListReport();
    }
    getDateRange(period) {
        let startDate = period[0].split('/');
        let endDate = period[1].split('/');
        this.startDate = moment([startDate[2], startDate[1] - 1, startDate[0]]);
        this.endDate = moment([endDate[2], endDate[1] - 1, endDate[0]]);

    }

    getAgeRange(age) {
        this.startAge = age[0];
        this.endAge = age[1];

    }

    translateIndicator(indicator) {
        return indicator.toLowerCase().split('_').map((word) => {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }
    generatePatientListReport() {
        this.isLoading = true;
        this.resourceService.getHivSummaryIndicatorsPatientList({
            endDate: this.endDate.format(),
            indicator: this.indicator,
            locationUuids: this.locationUuids,
            startDate: this.startDate.format(),
            startAge: this.startAge,
            endAge: this.endAge,
            gender: this.gender,
            startIndex: this.startIndex
        }).subscribe((report) => {
            this.patientData = this.patientData ? this.patientData.concat(report) : report;
            this.isLoading = false;
            this.startIndex += report.length;
            if (report.length < 300) {
                this.dataLoaded = true;
            }
        });
    }

    loadMorePatients() {
        this.generatePatientListReport();
    }

    redirectTopatientInfo(patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/landing-page']);
    }

    goBack() {
        this._location.back();
    }

}
