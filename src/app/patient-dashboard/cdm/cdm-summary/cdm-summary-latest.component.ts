
import {take} from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cdm-summary-latest',
  templateUrl: './cdm-summary-latest.component.html'
})
export class CdmSummaryLatestComponent implements OnInit, OnDestroy {
  public loadingCdmSummary = false;
  public subscription: Subscription;
  public patient: Patient;
  public patientUuid: any;
  public errors: any = [];
  public patientData: any;

  constructor(
    private patientService: PatientService,
    private cdmSummaryService: CdmSummaryResourceService) {}

  public ngOnInit() {
    this.getPatient();
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.loadingCdmSummary = true;
    this.subscription = this.patientService.currentlyLoadedPatient.pipe(take(1)).subscribe(
      (patient) => {
        if (patient) {
          this.loadingCdmSummary = false;
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadCdmSummary(this.patientUuid);
        }
      }, (err) => {
        this.loadingCdmSummary = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  public loadCdmSummary(patientUuid) {
    this.cdmSummaryService.getCdmSummary(patientUuid, 0, 1, false).pipe(
    take(1)).subscribe((data) => {
      if (data) {
        for (const summary of data) {
          if ( summary.is_clinical_encounter === 1) {
            this.patientData = summary;
            break;
          }
        }
      }
      this.loadingCdmSummary = false;
    }, (err) => {
      this.loadingCdmSummary = false;
      this.errors.push({
        id: 'CDM Summary',
        message: 'An error occured while loading CDM Summary. Please try again.'
      });
    });
  }

}
