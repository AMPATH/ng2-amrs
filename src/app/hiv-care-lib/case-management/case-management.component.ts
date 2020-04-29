
import { Component, OnInit , Input , OnChanges , SimpleChanges } from '@angular/core';

import { CaseManagementResourceService } from './../../etl-api/case-management-resource.service';

@Component({
    selector: 'case-management',
    templateUrl: './case-management.component.html',
    styleUrls: ['./case-management.component.css']
})

export class CaseManagementComponent implements OnInit , OnChanges {

    public title = 'Case Management';
    public patientList = [];

    constructor(private caseManagementResourceService: CaseManagementResourceService) {
    }

    public ngOnInit() {
        this.getPatientList();
    }


    public ngOnChanges(change: SimpleChanges) {
    }

    public getPatientList() {
        const params = {};
        this.caseManagementResourceService.getCaseManagementList(params)
        .subscribe((patients) => {
          this.patientList = patients;
        });
    }


}
