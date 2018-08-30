import { Component, OnInit, OnDestroy } from '@angular/core';

import { MedicationHistoryResourceService } from
  '../../../etl-api/medication-history-resource.service';
import { PatientService } from '../../services/patient.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'cdm-medication-change-history',
  templateUrl: './medication-history.component.html',
  styleUrls: []
})
export class CdmMedicationHistoryComponent implements OnInit, OnDestroy {
  public encounters = [];
  public patientUuid: any;
  public errors: any;
  public subscription: Subscription;

  constructor(private medicationHistoryResourceService: MedicationHistoryResourceService,
              private patientService: PatientService) {
  }

  public ngOnInit() {
    this.getPatient();
  }

  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patientUuid = patient.person.uuid;
          this.getMedicationHistory(this.patientUuid);
        }
      }
      , (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching medication history'
        });
      });
  }

  public getMedicationHistory(patientUuid): void {
    this.medicationHistoryResourceService.getCdmMedicationHistory(patientUuid)
    .subscribe((result) => {
      this.encounters = _.filter(result, (row) => {
        return !_.isNil(row.prescriptions);
      });
    }, (err) => {
      this.errors.push({
        id: 'patient',
        message: 'error fetching medication history'
      });
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
