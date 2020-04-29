import { Component, OnInit , Input , OnChanges , SimpleChanges } from '@angular/core';

@Component({
    selector: 'case-management',
    templateUrl: './case-management.component.html',
    styleUrls: ['./case-management.component.css']
})

export class CaseManagementComponent implements OnInit , OnChanges {

    public title = 'Case Management';

    constructor() {
    }

    public ngOnInit() {
    }


    public ngOnChanges(change: SimpleChanges) {
    }


}
