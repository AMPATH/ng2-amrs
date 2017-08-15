import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AddCohortMemberComponent } from './cohort-member/add-cohort-member.component';

@Component({
    selector: 'add-cohort-member-container',
    templateUrl: 'add-cohort-member-container.component.html'
})

export class AddCohortMemberContainerComponent implements OnInit {
    @ViewChild('addCohortComp')
    public addCohortComp: AddCohortMemberComponent;

    public cohortUuid: string;
    constructor(private route: ActivatedRoute, private router: Router) {

    }

    public ngOnInit() {
        this.route.url.subscribe((url) => {
            this.cohortUuid = url[1].path;
        });
        this.addCohortComp.showPatientSearchComponent();
    }

    public onSavedCohortMember() {
        this.router.navigate(['/patient-list-cohort/patient-list/cohort-members/' +
            this.cohortUuid]);
    }
}
