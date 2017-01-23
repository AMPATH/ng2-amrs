import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PatientSearchService } from './patient-search.service';
import { Patient } from '../../models/patient.model';
@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css'],
})

export class PatientSearchComponent implements OnInit {
  searchString: string;
  patients: Patient[];
  isResetButton: boolean = false;
  totalPatients: number;
  isLoading: boolean = false;
  page: number = 1;
  public errorMessage: string;

  constructor(private patientSearchService: PatientSearchService, private router: Router) {
  }


  ngOnInit() {
    // load cached result
    this.patientSearchService.patientsSearchResults.subscribe(
      (patients) => {
        this.patients = patients;
        this.searchString = this.patientSearchService.searchString;
        this.totalPatients = this.patients.length;
      }
    );
  }


  loadPatient(): void {
    this.totalPatients = 0;
    if (this.searchString && this.searchString.length > 2) {
      this.isLoading = true;
      this.patients = [];
      let request = this.patientSearchService.searchPatient(this.searchString, false);
      request
        .subscribe(
        (data) => {
          if (data.length > 0) {
            this.patients = data;
            this.totalPatients = this.patients.length;
            this.isLoading = false;
          }

        },
        (error) => {
          this.isLoading = false;
          console.log('error', error);
          this.errorMessage = error;
        }
        );

      this.isResetButton = true;

    }
  }

  updatePatientCount(search) {

    if (this.totalPatients > 0 && search.length > 0) {
      this.totalPatients = 0;
    }
  }

  loadPatientData(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }

    this.router.navigate(['/patient-dashboard/' + patientUuid + '/patient-info']);

  }


  resetSearchList() {
    this.patientSearchService.resetPatients();
    this.searchString = '';
    this.isResetButton = false;
  }

  public tooltipStateChanged(state: boolean): void {
    // console.log(`Tooltip is open: ${state}`);
  }


}
