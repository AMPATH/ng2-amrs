import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RetentionReportResourceService } from './../../../etl-api/retention-report-resource.service';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { RetentionReportBaseComponent } from './../../../hiv-care-lib/retention-report/retention-report-base.component';
import { ClinicDashboardCacheService } from './../../services/clinic-dashboard-cache.service';

@Component({
    selector: 'clinic-dashboard-retention-report',
    templateUrl: './clinic-dashboard-retention-report.component.html',
    styleUrls: ['./clinic-dashboard-retention-report.component.css']
})

export class ClinicDashboardRetentionReportComponent implements OnInit {

    public title = 'Retention Report Indicators';
    public locationUuids: any = [];
    public routeSub: Subscription = new Subscription();
    public dashboardType = 'clinic-dashboard';

    constructor( public router: Router,
        public route: ActivatedRoute,
        public retentionReportService: RetentionReportResourceService,
        private clinicDashboardCacheService: ClinicDashboardCacheService) {
    }

    public ngOnInit() {
        this.clinicDashboardCacheService.getCurrentClinic().subscribe((currentClinic) => {
            this.locationUuids = currentClinic;
          });
          this.routeSub = this.route.parent.parent.params.subscribe((params) => {
            this.locationUuids = params['location_uuid'];
            this.clinicDashboardCacheService.setCurrentClinic(params['location_uuid']);
          });
    }

}
