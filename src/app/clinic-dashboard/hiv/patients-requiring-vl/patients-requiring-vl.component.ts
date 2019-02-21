import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
    PatientsRequiringVLBaseComponent
 } from '../../../hiv-care-lib/patients-requiring-vl/patients-requiring-vl-base.component';
import {
    PatientsRequiringVLResourceService
 } from '../../../etl-api/patients-requiring-vl-resource.service';

@Component({
    selector: 'patients-requiring-vl',
    // tslint:disable-next-line:max-line-length
    templateUrl: '../../../hiv-care-lib/patients-requiring-vl/patients-requiring-vl-base.component.html'
})

export class PatientsRequiringVLComponent
    extends PatientsRequiringVLBaseComponent implements OnInit {
    public data = [];
    public sectionsDef = [];

    constructor(public patientsRequiringVLResourceService: PatientsRequiringVLResourceService,
                public route: ActivatedRoute, private location: Location,
                public router: Router) {
        super(route, router, patientsRequiringVLResourceService);

    }

    public ngOnInit() {

        this.route.parent.parent.url.subscribe((url) => {
            this.locationUuids = [];
            this.locationUuids.push(url[0].path);
        });
        this.loadReportParamsFromUrl();
    }

    public generateReport() {
        this.storeReportParamsInUrl();
        super.generateReport();
    }

    public loadReportParamsFromUrl() {
        const path = this.router.parseUrl(this.location.path());
        const pathHasHistoricalValues = path.queryParams['startDate'] &&
            path.queryParams['endDate'];

        if (path.queryParams['startDate']) {
            this.startDate = new Date(path.queryParams['startDate']);
        }

        if (path.queryParams['endDate']) {
            this.endDate = new Date(path.queryParams['endDate']);
        }

        if (pathHasHistoricalValues) {
            this.generateReport();
        }
    }

    public storeReportParamsInUrl() {
        const path = this.router.parseUrl(this.location.path());
        path.queryParams = {
            'startDate': this.startDate.toUTCString(),
            'endDate': this.endDate.toUTCString(),
        };

        this.location.replaceState(path.toString());
    }

}
