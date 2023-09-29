import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HivSummaryService } from '../hiv-summary.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
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
  isHEIActive: boolean;
  public hasError = false;
  public hivSummary: any;
  public patient: Patient;
  public subscription: Subscription[] = [];
  public errors: any = [];

  constructor(
    private patientService: PatientService,
    private hivSummaryService: HivSummaryService
  ) {}

  public ngOnInit() {
    this.loadPatient();
    this.getPatientHivSummary(this.patientUuid);
    console.log('ngOnInit patientuuid: ', this.patientUuid);
  }

  public loadPatient() {
    this.patientService.currentlyLoadedPatient.subscribe((patient) => {
      console.log('patient==> ', patient);
      this.patientUuid = patient.person.uuid;
    });
    // this.patientResourceService.
    // getPatientByUuid(this.patientUuid).subscribe(
    //   (data: Patient) => {
    //     console.log("patient: ", data)
    //     this.patient = data;
    //   },
    //   (err) => {
    //     this.loadingAhdSummary = false;
    //     this.errors.push({
    //       id: 'AHD Summary',
    //       message:
    //         'An error occured while loading AHD Summary. Please try again.'
    //     });
    //   });
  }

  public getPatientHivSummary(patientUuid) {
    console.log('getpatientpatientuuid' + patientUuid);
    const summary = this.hivSummaryService
      .getHivSummary(patientUuid, 0, 1, false, this.isHEIActive)
      .subscribe((data) => {
        console.log(data);
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
