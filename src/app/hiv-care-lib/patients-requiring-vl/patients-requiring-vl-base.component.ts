import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import * as Moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import {
    PatientsRequiringVLResourceService
} from '../../etl-api/patients-requiring-vl-resource.service';

@Component({
    selector: 'patient-requiring-vl',
    template: 'patients-requiring-vl-base.component.html'
})
export class PatientsRequiringVLBaseComponent implements OnInit {

    public data = [];
    public filteredData = [];

    public isLoadingReport: boolean = false;
    public encounteredError: boolean = false;
    public errorMessage: string = '';
    public overrideColumns: Array<any> = [];
    public _locations: string = '';
    public currentVLDate: Date;
    private _startDate: Date = Moment().subtract(1, 'months').toDate();
    public get startDate(): Date {
        return this._startDate;
    }

    public set startDate(v: Date) {
        this._startDate = v;
    }

    private _endDate: Date = new Date();
    public get endDate(): Date {
        return this._endDate;
    }

    public set endDate(v: Date) {
        this._endDate = v;
    }

    private _locationUuids: Array<string>;
    public get locationUuids(): Array<string> {
        return this._locationUuids;
    }

    public set locationUuids(v: Array<string>) {
        this._locationUuids = v;
    }

    constructor(public route: ActivatedRoute,
                public router: Router,
                public patientsRequiringVLResourceService: PatientsRequiringVLResourceService) {
    }

    public extraColumns() {
        return [
            {
                headerName: 'Most Recent VL',
                field: 'current_vl',
                width: 110,
                cellStyle: {
                    'white-space': 'normal'
                },
                cellRenderer: (column: any) => {
                    return this.transformVl(column.value);
                }
            },
            {
                headerName: 'Most Recent VL Date',
                field: 'current_vl_date',
                width: 140,
                cellStyle: {
                    'white-space': 'normal'
                }
            },
            {
                headerName: 'Last VL Order Date',
                field: 'last_vl_order_date',
                width: 160,
                cellStyle: {
                    'white-space': 'normal'
                }
            },
            {
                headerName: 'Days Since Last Order',
                field: 'days_since_last_order',
                width: 170,
                cellStyle: {
                    'white-space': 'normal'
                }
            }
        ];
    }

   public ngOnInit() {
    }

    public  transformVl(vl) {
        if (vl === 0 || vl === '0') {
            return 'LDL';
        }else {
            return vl;
     }

    }

     public generateReport() {
        // set busy indications variables
        // clear error
        this.encounteredError = false;
        this.errorMessage = '';
        this.isLoadingReport = true;
        this.data = [];

        this.patientsRequiringVLResourceService
            .getPatientList(this.toDateString(this.startDate), this.toDateString(this.endDate),
            this.getSelectedLocations(this.locationUuids)).subscribe(
            (data) => {
                this.isLoadingReport = false;
                this.data = data.result;
                this.filteredData = this.data;
            }, (error) => {
                this.isLoadingReport = false;
                this.errorMessage = error;
                this.encounteredError = true;
            });

        this.overrideColumns.push({
            field: 'identifiers',
            onCellClicked: (column) => {
                this.goTopatientInfo(column.data.patient_uuid);
            },
            cellRenderer: (column) => {
                return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
            }
        });
    }

     public goTopatientInfo(patientUuid) {
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this.router.navigate(['/patient-dashboard/patient/' +
        patientUuid + '/general/landing-page']);
    }

     public onCurrentVLDateChanged(currentVLDate) {
        if (!currentVLDate) {
            this.filteredData = this.data;
        } else {
            let filteredPatients = this.data.filter((patient) => {
                return Moment(patient.current_vl_date, 'DD-MM-YYYY')
                    .isBefore(Moment(currentVLDate, 'YYYY-MM-DD'));
            });

            this.filteredData = filteredPatients;
        }
    }

    private getSelectedLocations(locationUuids: Array<string>): string {
        if (!locationUuids || locationUuids.length === 0) {
            return '';
        }

        let selectedLocations = '';

        for (let i = 0; i < locationUuids.length; i++) {
            if (i === 0) {
                selectedLocations = selectedLocations + locationUuids[0];
            } else {
                selectedLocations = selectedLocations + ',' + locationUuids[i];
            }
        }
        return selectedLocations;
    }

    private toDateString(date: Date): string {
        return Moment(date).utcOffset('+03:00').format();
    }
}
