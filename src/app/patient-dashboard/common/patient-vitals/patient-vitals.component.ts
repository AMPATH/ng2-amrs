
import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Helpers } from '../../../utils/helpers';
import { Subscription } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { PatientVitalsService } from './patient-vitals.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.css']
})
export class PatientVitalsComponent implements OnInit, OnDestroy {

  public loadingVitals = false;

  public vitals: Array<any> = [];

  public patient: Patient;

  public dataLoaded = false;

  public errors: any = [];
  public page = 1;

  public patientUuid: any;
  public subscription: Subscription;

  public nextStartIndex = 0;
  public isLoading = false;

  constructor(private patientVitalsService: PatientVitalsService,
    private patientService: PatientService) { }

  public ngOnInit() {
    this.getPatient();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.take(1).subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.loadVitals(patient.person.uuid, this.nextStartIndex);
          this.patientUuid = patient.person.uuid;
        }
      }
      , (err) => {

        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }
  public loadVitals(patientUuid, nextStartIndex): void {
    this.loadingVitals = true;

    this.patientVitalsService.getvitals(this.patient, this.nextStartIndex).subscribe((data) => {
      if (data) {
        if (data.length > 0) {

          const membersToCheck = ['weight', 'height', 'temp', 'oxygen_sat', 'systolic_bp',
            'diastolic_bp', 'pulse'];
          for (const r in data) {
            if (data.hasOwnProperty(r)) {
              const encounter = data[r];
              if (!Helpers.hasAllMembersUndefinedOrNull(encounter, membersToCheck)) {

                this.vitals.push(encounter);

              }

            }

          }
          const size: number = data.length;
          this.nextStartIndex = this.nextStartIndex + size;
          this.isLoading = false;
          this.loadingVitals = false;
        } else {

          this.dataLoaded = true;
          this.loadingVitals = false;

        }

      }

      this.isLoading = false;
    },

      (err) => {
        this.loadingVitals = false;
        this.errors.push({
          id: 'vitals',
          message: 'error fetching patient'
        });
      });
  }
  public loadMoreVitals() {
    this.loadVitals(this.patientUuid, this.nextStartIndex);

  }
}
