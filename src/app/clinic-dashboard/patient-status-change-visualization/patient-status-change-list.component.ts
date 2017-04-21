import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PatientStatusVisualizationResourceService } from
    '../../etl-api/patient-status-change-visualization-resource.service';
import { PatientlistCellComponent } from './patient-list-cell.component';
import {
    ClinicDashboardCacheService
} from '../services/clinic-dashboard-cache.service';


@Component({
    selector: 'patient-status-change-list',
    templateUrl: 'patient-status-change-list.component.html'
})

export class PatientStatusChangeListComponent implements OnInit {
    private columns = [];
    private filterModel: any;
    private filterParams: any;
    private chartOptions: any;
    private startDate = new Date();
    private endDate = new Date();
    private data = [];
    private indicator = '';
    private loading = false;
    private error = false;
    private options: any = {
        date_range: true
    };
    constructor(private route: ActivatedRoute,
    private patientStatusVisualizationResourceService: PatientStatusVisualizationResourceService,
        private clinicDashboardCacheService: ClinicDashboardCacheService) { }

    ngOnInit() {
        this.startDate = new Date(this.route.snapshot.queryParams['startDate']);
        this.endDate = new Date(this.route.snapshot.queryParams['endDate']);
        this.indicator = this.route.snapshot.queryParams['indicator'];
        this.generateColumDefinations();
    }
    private generateColumDefinations() {
        let columns = [];
        let columnLabelMap = {
            'identifiers': {
                columnTitle: 'Identifiers',
                pinned: true,
                patient_list: true
            },
            'person_name': {
                columnTitle: 'Person Name',
                pinned: true,
                patient_list: true
            },
            'gender': {
                columnTitle: 'Gender',
                pinned: false,
                patient_list: false
            },
            'age': {
                columnTitle: 'Age',
                pinned: false,
                patient_list: false
            }
        };
        for (let row in columnLabelMap) {
            if (columnLabelMap.hasOwnProperty(row)) {
                let rowData = columnLabelMap[row];
                let column = {
                    headerName: rowData.columnTitle,
                    pinned: rowData.pinned,
                    width: 100,
                    field: row
                };
                if (rowData.patient_list) {
                    column['cellRendererFramework'] = PatientlistCellComponent;
                }
                columns.push(column);
            }

        }
        this.columns = columns;
    }

    private filtersChanged(event) {
        console.log(event);
        let params = {};
        params['startDate'] = event.startDate.format('YYYY-MM-DD');
        params['endDate'] = event.endDate.format('YYYY-MM-DD');
        params['indicator'] = this.indicator;
        this.filterParams = params;
        this.getPatients();
    }

    private getPatients() {
        this.loading = true;
        this.error = false;
        this.clinicDashboardCacheService.getCurrentClinic().flatMap((location) => {
            if (location) {
                this.filterParams['locationUuids'] = location;
                return this.patientStatusVisualizationResourceService
                .getPatientList(this.filterParams);
            }
            return [];
        }).subscribe((results) => {
            this.loading = false;
            this.data = results.result;
        }, (error) => {
            this.error = true;
            this.loading = false;
        });

    }
}
