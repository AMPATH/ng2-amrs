import { Component, OnInit, OnDestroy } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cdm-summary-historical',
  templateUrl: './cdm-summary-historical.component.html'
})
export class CdmSummaryHistoricalComponent implements OnInit, OnDestroy {
  public loadingCdmSummary: boolean = false;
  public cdmSummaries: Array<any> = [];
  public patient: Patient;
  public patientUuid: any;
  public subscription: Subscription;
  public experiencedLoadingError: boolean = false;
  public dataLoaded: boolean = false;
  public errors: any = [];
  public isLoading: boolean;
  public nextStartIndex: number = 0;
  public limit = 20;
  public page: number = 1;

  constructor(
    private patientService: PatientService,
    private cdmSummaryService: CdmSummaryResourceService
  ) {}

  public ngOnInit() {
    this.getPatient();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.loadingCdmSummary = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.loadingCdmSummary = false;
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadCdmSummary(this.patientUuid, this.nextStartIndex );
        }
      }, (err) => {
        this.loadingCdmSummary = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  public loadCdmSummary(patientUuid, nextStartIndex) {
    this.cdmSummaryService.getCdmSummary(patientUuid, this.nextStartIndex, 20, false)
    .subscribe((data) => {
      if (data) {
        if (data.length > 0) {
          for (let r in data) {
            if (data.hasOwnProperty(r)) {
              let cdmsum = data[r];
              this.cdmSummaries.push(cdmsum);
            }
          }
          let size: number = data.length;
          this.nextStartIndex = this.nextStartIndex + size;
          this.isLoading = false;
        } else {
            this.dataLoaded = true;
        }
      }
    }, (err) => {
      this.loadingCdmSummary = false;
      this.errors.push({
          id: 'Cdm Summary',
          message: 'An error occured while loading Cdm Summary. Please try again.'
      });

    });
  }

  public loadMoreCdmSummary() {
    this.isLoading = true;
    this.loadCdmSummary(this.patientUuid, this.nextStartIndex);
  }

}
