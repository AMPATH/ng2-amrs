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
  error: string;
  loadingPatient: Boolean;
  fetchingResults: Boolean;
  isLoading: boolean;
  patientUuId: any;
  nextStartIndex: number = 0;
  dataLoaded: boolean = false;
  labResults = [];
  constructor(private labsResourceService: LabsResourceService,
              private patientService: PatientService) { }

  ngOnInit() {
    this.loadingPatient = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.loadingPatient = false;
        if (patient) {
          this.patient = patient;
          this.patientUuId = this.patient.person.uuid;
          this.getHistoricalPatientLabResults(this.patientUuId,
            {startIndex: this.nextStartIndex.toString(), limit: '20'});
        }
      }
    );
  }
  getHistoricalPatientLabResults(patientUuId, params: { startIndex: string, limit: string }) {
    this.patientUuId = this.patient.person.uuid;
    this.fetchingResults = true;
    this.labsResourceService.getHistoricalPatientLabResults(this.patientUuId,
      {startIndex: this.nextStartIndex.toString(), limit: '20'}).subscribe((result) => {
      if (result) {
        if (result.length > 0) {
          for (let r in result) {
            if (result.hasOwnProperty(r)) {
              let lab = result[r];
                this.labResults.push(lab);
            }

          }
          let size: number = result.length;
          this.nextStartIndex = +(params.startIndex) + size;
          this.isLoading = false;
        } else {
          this.dataLoaded = true;
        }
      }
    }, (err) => {
      this.fetchingResults = false;
      this.error = err;
    });

  }
  loadMoreLabResults() {
    this.isLoading = true;
    this.getHistoricalPatientLabResults(this.patientUuId,
        {startIndex: this.nextStartIndex.toString() , limit: '20'});
  }
}
