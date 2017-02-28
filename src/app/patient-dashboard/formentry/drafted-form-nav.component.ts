import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { DraftedFormsService } from './drafted-forms.service';
import { PatientService } from '../patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'drafted-form-nav',
  template: `
    <button *ngIf="isDraftFormPresent" (click)="loadDraftedForm()"
        class="btn btn-warning " style="float: right;margin-right:4px; margin-top:4px;" >
            <span class="fa fa-file "></span> <span> Back to Drafted Form </span>
    </button>
    `
})
export class DraftedFormNavComponent implements OnInit, OnDestroy {
  public isDraftFormPresent: boolean = false;
  subscription: Subscription;
  private patientUuid;

  constructor(private draftedFormsService: DraftedFormsService,
              private patientService: PatientService,
              private router: Router) {
    this.subscription = this.patientService.currentlyLoadedPatientUuid
      .subscribe(uuid => this.patientUuid = uuid);
  }

  ngOnInit() {
    this.draftedFormsService.draftedForm.subscribe((form) => {

      if (this.draftedFormsService.hasBeenCancelled) {
        this.isDraftFormPresent = false;
        if (this.draftedFormsService.lastDraftedForm !== null) {
          this.draftedFormsService.setDraftedForm(null);
          this.draftedFormsService.lastDraftedForm = null;
          this.draftedFormsService.hasBeenCancelled = false;
        }
      } else {

        if (form === null || form === undefined) {
          this.isDraftFormPresent = false;
        } else {
          this.isDraftFormPresent = true;
        }

      }

    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadDraftedForm() {
    this.draftedFormsService.loadDraftOnNextFormLoad = true;
    this.isDraftFormPresent = false;
    this.router.navigate(['/patient-dashboard/' +
    this.patientUuid + '/formentry/' +
    this.draftedFormsService.lastDraftedForm.valueProcessingInfo['formUuid']]);
  }
}
