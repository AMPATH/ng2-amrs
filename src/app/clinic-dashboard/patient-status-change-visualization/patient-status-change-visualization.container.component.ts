import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientStatusVisualizationResourceService } from
    '../../etl-api/patient-status-change-visualization-resource.service';
import {
    ClinicDashboardCacheService
} from '../services/clinic-dashboard-cache.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'patient-status-change-visualization-container',
    templateUrl: './patient-status-change-visualization.container.component.html',
    styleUrls: ['./patient-status-change-visualization.container.component.css']
})

export class PatientStatusChangeVisualizationContainerComponent implements OnInit, OnDestroy {
    results = {
        startIndex: 0,
        size: 13,
        result: [
        ]
    };
    barIndicators = ['total_patients', 'currently_in_care_total',
        'new_patients', 'transfer_in', 'transfer_out', 'deaths'];
    lineIndicators = ['total_patients'];
    private filterModel: any;
    private filterParams: any;
    private chartOptions: any;
    private startDate = new Date();
    private endDate = new Date();
    private dataSub: Subscription = new Subscription();
    private error = false;
    private loading = false;
    private options: any = {
        date_range: true
    };

    constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
    private patientStatusVisualizationResourceService: PatientStatusVisualizationResourceService) {
        this.filterModel = this.filterModel ? this.filterModel : {};
        this.endDate = this.getEndDate();
    }

    ngOnInit() { }
    ngOnDestroy(): void {
        this.dataSub.unsubscribe();
    }

    private filtersChanged(event) {

        let params = {};
        params['startDate'] = event.startDate.format('YYYY-MM-DD');
        params['endDate'] = event.endDate.format('YYYY-MM-DD');
        this.filterParams = params;
        this.loadData();
    }
    private getEndDate() {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let c = new Date(year + 1, month, day);
        return c;
    }
    private loadData() {
        this.error = false;
        this.loading = true;
        this.dataSub = this.clinicDashboardCacheService.getCurrentClinic().flatMap((location) => {
            let params = Object.assign(this.filterParams, { locationUuids: location });
            return this.patientStatusVisualizationResourceService.getAggregates(params);
        }).subscribe((results) => {
            this.loading = false;
            this.results = results;
        }, (error) => {
            this.error = true;
            this.loading = false;
        });
    };
}
