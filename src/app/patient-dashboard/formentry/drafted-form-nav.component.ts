import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DraftedFormsService } from './drafted-forms.service';
import { PatientService } from '../patient.service';

@Component({
    selector: 'drafted-form-nav',
    template: `
    <button *ngIf="isDraftFormPresent" (click)="loadDraftedForm()"
        class="btn btn-warning " style="float: right;margin-right:4px; margin-top:4px;" >
            <span class="fa fa-file "></span> <span> Back to Drafted Form </span>
    </button>
    `
})
export class DraftedFormNavComponent implements OnInit {
    public isDraftFormPresent: boolean = false;
    private patientUuid;
    constructor(
        private draftedFormsService: DraftedFormsService,
        private patientService: PatientService,
        private router: Router) {
        this.patientService.currentlyLoadedPatientUuid.subscribe(uuid => this.patientUuid = uuid);
    }
    ngOnInit() {
        this.draftedFormsService.draftedForm.subscribe((form) => {
            if (form === null || form === undefined) {
                this.isDraftFormPresent = false;
            } else {
                this.isDraftFormPresent = true;
            }
        });
    }

    loadDraftedForm() {
        this.draftedFormsService.loadDraftOnNextFormLoad = true;
        this.isDraftFormPresent = false;
        this.router.navigate(['/patient-dashboard/' +
            this.patientUuid + '/formentry/' +
            this.draftedFormsService.lastDraftedForm.valueProcessingInfo['formUuid']]);
    }
}
