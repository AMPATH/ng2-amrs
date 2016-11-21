import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { LabsResourceService } from '../../etl-api/labs-resource.service';
@Component({
  selector: 'lab-result',
  templateUrl: 'lab-result.component.html',
  styleUrls: []
})
export class LabResultComponent implements OnInit {
  patient: any;
  results = [];
  error: string;
  loadingPatient: Boolean;
  fetchingResults: Boolean;
  constructor(private labsResourceService: LabsResourceService,
              private patientService: PatientService) { }

  ngOnInit() {
    this.loadingPatient = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.loadingPatient = false;
        if (patient) {
          this.patient = patient;
          this.getHistoricalPatientLabResults();
        }
      }
    );
  }
  getHistoricalPatientLabResults() {
    let patientUuId = this.patient.person.uuid;
    this.fetchingResults = true;
    this.labsResourceService.getHistoricalPatientLabResults(patientUuId,
      {startIndex: '0', limit: '20'}).subscribe((result) => {
      this.fetchingResults = false;
      this.results = result;
    }, (err) => {
      this.fetchingResults = false;
      this.error = err;
    });
  }
}
