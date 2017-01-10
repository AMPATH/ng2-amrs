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

    if (this.searchString && this.searchString.length > 2) {
      this.isLoading = true;
      this.patients = [];
      let request = this.patientSearchService.searchPatient(this.searchString, false);
      request
        .subscribe(
          (data) => {
            this.patients = data;
            this.totalPatients = this.patients.length;


          },
          (error) => {

            console.log('error', error);
            this.errorMessage = error;
          }
        );
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);

      this.isResetButton = true;

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
