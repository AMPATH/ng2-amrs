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

  dataLoaded: boolean = false;

  errors: any = [];

  patientUuid: any;

  nextStartIndex: number = 0;
  isLoading: boolean = false;

  constructor(private patientVitalsService: PatientVitalsService,
    private patientService: PatientService) { }

  ngOnInit() {
    this.getPatient();
  }
  getPatient() {
        this.loadingVitals = true;
    this.patientService.currentlyLoadedPatient.subscribe(
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
  loadVitals(patientUuid, nextStartIndex): void {
    let request = this.patientVitalsService.getvitals(patientUuid, this.nextStartIndex)
      .subscribe((data) => {
        if (data) {
          if (data.length > 0) {

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
            console.log('ssssssiiiiiiiiiiiize------>>>', size);
            this.nextStartIndex = this.nextStartIndex + size;
            this.isLoading = false;
          } else {

            this.dataLoaded = true;

          }

        }


        this.loadingVitals = false;
        // this.vitals = data;
         // this.isLoading = false;
      },

      (err) => {
        this.loadingVitals = false;
        this.errors.push({
          id: 'vitals',
          message: 'error fetching patient'
        });
      });
  }
  loadMoreVitals() {
    this.isLoading = true;

    this.loadVitals(this.patientUuid, this.nextStartIndex);

  }
}
