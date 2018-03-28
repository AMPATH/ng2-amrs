import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Moh731ReportBaseComponent }
    from '../../../hiv-care-lib/moh-731-report/moh-731-report-base.component';
import { Moh731ResourceService } from '../../../etl-api/moh-731-resource.service';

@Component({
    selector: 'moh-731-report',
    templateUrl: '../../../hiv-care-lib/moh-731-report/moh-731-report-base.component.html'
})

export class Moh731ReportComponent extends Moh731ReportBaseComponent implements OnInit {
    public data = [];
    public sectionsDef = [];

    constructor(public moh731Resource: Moh731ResourceService,
                private route: ActivatedRoute, private location: Location,
                private router: Router) {
        super(moh731Resource);

        this.showIsAggregateControl = true;
        this.showLocationsControl = true;
    }

    public ngOnInit() {
        // this.loadReportParamsFromUrl();
    }

    public generateReport() {
        // this.storeReportParamsInUrl();

        if (Array.isArray(this.locationUuids) && this.locationUuids.length > 0) {
            super.generateReport();
        } else {
            this.errorMessage = 'Locations are required!';
        }
    }

}
