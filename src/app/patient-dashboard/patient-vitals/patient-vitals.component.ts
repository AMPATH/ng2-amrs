import { Component, OnInit, Input } from '@angular/core';

import { Helpers } from '../../utils/helpers';
import { Subscription } from 'rxjs';
import { PatientService } from '../patient.service';
import { PatientVitalsService } from './patient-vitals.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.css']
})
export class PatientVitalsComponent implements OnInit {

  loadingVitals: boolean = false;

  vitals: Array<any> = [];

  patient: Patient;

  experiencedLoadingError: boolean = false;

  dataLoaded: boolean = false;

  errors: any = [];

  constructor(private patientVitalsService: PatientVitalsService,
    private patientService: PatientService) { }

  ngOnInit() {
    this.loadVitals(true);
    this.patientVitalsService.allDataLoaded.subscribe(
      (status) => {
        if (status) {
          this.dataLoaded = true;
          this.loadingVitals = false;
        }
      }
    );
  }
  loadVitals(isCached: boolean): void {
    this.loadingVitals = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientVitalsService.getvitals(this.patient.uuid, isCached)
            .subscribe((data) => {
              if (data) {
                let membersToCheck = ['weight', 'height', 'temp', 'oxygen_sat', 'systolic_bp',
                  'diastolic_bp', 'pulse'];

                for (let r in data) {
                  if (data.hasOwnProperty(r)) {
                    let encounter = data[r];

                    if (!Helpers.hasAllMembersUndefinedOrNull(encounter, membersToCheck))
                      this.vitals.push(encounter);
                  }

                }

                let size: number = data.length;
                this.loadingVitals = false;
                // this.vitals = data;
              }

            }, (err) => {
              this.loadingVitals = false;
              this.experiencedLoadingError = true;
              // all data loaded
              this.dataLoaded = true;
            }, () => {
              // complete
              this.dataLoaded = true;
              this.loadingVitals = false;
            }
            );
        }
      },
      (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      },
      () => {
        // all data loaded
        this.dataLoaded = true;
      }

    );
  }

}
