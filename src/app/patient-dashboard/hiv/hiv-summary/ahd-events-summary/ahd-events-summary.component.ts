import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HivSummaryService } from '../hiv-summary.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-ahd-events-summary',
  templateUrl: './ahd-events-summary.component.html',
  styleUrls: ['./ahd-events-summary.component.css']
})
export class AhdEventsSummaryComponent implements OnInit, OnDestroy {
  // public tbTreatmentSummary: any = '';
  // @Input() public patient: Patient;
  public patientUuid: any;
  public patient: Patient;
  isHEIActive = false;
  public hasError = false;
  public hivSummary: any;
  public subscription: Subscription[] = [];
  public errors: any = [];
  public loadingAhdSummary = false;

  constructor(
    private patientService: PatientService,
    private hivSummaryService: HivSummaryService
  ) {}

  public ngOnInit() {
    this.loadPatient();
  }

  public loadPatient() {
    this.loadingAhdSummary = true;
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        console.log('patient==> ', patient);
        if (patient) {
          this.patient = patient;
          this.patientUuid = patient.person.uuid;
          this.getPatientHivSummary(this.patientUuid);
        }
        this.loadingAhdSummary = false;
      },
      (err) => {
        this.loadingAhdSummary = true;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      }
    );
    this.subscription.push(patientSub);
  }

  public getPatientHivSummary(patientUuid) {
    console.log('HIVSUm getpatientpatientuuid ; ' + patientUuid);
    const summary = this.hivSummaryService
      .getHivSummary(patientUuid, 0, 1, false, this.isHEIActive)
      .subscribe((data) => {
        console.log('HIV SUMMARY DATA: ', data);
        if (data) {
          for (const result of data) {
            console.log('results' + result);
            if (result.is_clinical_encounter === 1) {
              this.hivSummary = result;
            }
          }
        }
      });
    this.subscription.push(summary);
  }

  public ngOnDestroy() {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
